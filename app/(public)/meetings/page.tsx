import { Suspense } from 'react';
import Link from 'next/link';
import { getMeetings } from '@/lib/meetings-db';

type SacramentMeeting = Awaited<ReturnType<typeof getMeetings>>[number];

interface MeetingsPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 5;

function matchesQuery(meeting: SacramentMeeting, rawQuery: string): boolean {
  if (!rawQuery) return true;
  const q = rawQuery.toLowerCase();

  const speakerValues = Array.isArray(meeting.speakers)
    ? meeting.speakers.flatMap((s: { name?: unknown; topic?: unknown }) => [s?.name, s?.topic])
    : [];

  const searchableFields: Array<unknown> = [
    meeting.date,
    meeting.meetingType,
    meeting.presiding,
    meeting.conducting,
    meeting.openingPrayer,
    meeting.closingPrayer,
    meeting.openingHymn?.title,
    meeting.openingHymn?.number,
    meeting.sacramentHymn?.title,
    meeting.sacramentHymn?.number,
    meeting.closingHymn?.title,
    meeting.closingHymn?.number,
    ...speakerValues,
  ];

  return searchableFields.some(
    (val) => val !== undefined && val !== null && String(val).toLowerCase().includes(q)
  );
}

async function MeetingsListContent({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = (resolvedParams.query ?? '').trim();
  const parsedPage = Number(resolvedParams.page ?? '1');
  const requestedPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const rawMeetings: SacramentMeeting[] = await getMeetings(query);
  const filteredMeetings = rawMeetings.filter((m) => matchesQuery(m, query));

  const totalCount = filteredMeetings.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMeetings = filteredMeetings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (targetPage > 1) params.set('page', String(targetPage));
    const qs = params.toString();
    return qs ? `/meetings?${qs}` : '/meetings';
  };

  return (
    <div className="space-y-6">
      <form action="/meetings" method="GET" className="flex flex-col sm:flex-row gap-2 max-w-lg">
        <label htmlFor="meeting-search" className="sr-only">
          Search meetings
        </label>
        <input
          id="meeting-search"
          type="search"
          name="query"
          defaultValue={query}
          placeholder="Search by presiding, conducting, speaker, or type..."
          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
        >
          Search
        </button>
        {query && (
          <Link
            href="/meetings"
            className="rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-sm font-medium no-underline flex items-center justify-center"
          >
            Clear
          </Link>
        )}
      </form>

      {paginatedMeetings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-sm text-slate-500">
          No sacrament meetings found{query ? ` for "${query}"` : ''}.
        </div>
      ) : (
        <div className="grid gap-4">
          {paginatedMeetings.map((meeting: SacramentMeeting) => (
            <article
              key={meeting.id}
              className="meeting-card rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {meeting.meetingType}
                  </span>
                  <span className="text-sm font-medium text-slate-500">{meeting.date}</span>
                </div>
                <h2 className="text-lg font-semibold">
                  <Link href={`/meetings/${meeting.id}`} className="no-underline hover:underline">
                    Sacrament Meeting — {meeting.date}
                  </Link>
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Presiding:</strong> {meeting.presiding} · <strong>Conducting:</strong>{' '}
                  {meeting.conducting}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/meetings/${meeting.id}`}
                  className="text-sm font-medium px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 no-underline hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  View Program
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm"
        >
          <span className="text-slate-500">
            Page {currentPage} of {totalPages} ({totalCount} total)
          </span>
          <div className="flex items-center gap-2">
            {currentPage > 1 ? (
              <Link
                href={buildPageHref(currentPage - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 no-underline hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Previous
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed">
                Previous
              </span>
            )}

            {currentPage < totalPages ? (
              <Link
                href={buildPageHref(currentPage + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 no-underline hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Next
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed">
                Next
              </span>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}

export default function MeetingsPage(props: MeetingsPageProps) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Sacrament Meetings</h1>
        <p className="text-sm text-slate-500">
          Browse upcoming and past sacrament meeting programs.
        </p>
      </header>

      <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading meetings...</div>}>
        <MeetingsListContent searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}