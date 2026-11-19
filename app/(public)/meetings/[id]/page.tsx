import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMeetingById } from '@/lib/meetings-db';

interface MeetingDetailPageProps {
  params: Promise<{ id: string }>;
}

interface SpeakerItem {
  name?: string;
  topic?: string;
}

function formatItem(item: unknown): string {
  if (typeof item === 'string') return item;
  if (item && typeof item === 'object') {
    const record = item as Record<string, unknown>;
    const label = record.description ?? record.title ?? record.name ?? record.text;
    const person = record.person ?? record.member ?? record.calling;
    if (label && person) return `${String(label)} (${String(person)})`;
    if (label) return String(label);
    if (person) return String(person);
    return JSON.stringify(item);
  }
  return String(item ?? '');
}

async function MeetingProgramDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const meeting = await getMeetingById(id);

  if (!meeting) {
    notFound();
  }

  return (
    <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {meeting.meetingType} Meeting
        </span>
        <span className="text-sm font-medium text-slate-500">{meeting.date}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Sacrament Meeting Program</h1>
          <p className="text-sm text-slate-500">Meeting #{meeting.id}</p>
        </div>
        <Link
          href={`/meetings/${meeting.id}/edit`}
          className="no-print text-sm font-medium px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 no-underline hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Edit Meeting
        </Link>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-100 dark:border-slate-800">
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Presiding:</span>{' '}
          {meeting.presiding}
        </div>
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Conducting:</span>{' '}
          {meeting.conducting}
        </div>
      </section>

      {Array.isArray(meeting.announcements) && meeting.announcements.length > 0 && (
        <section className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Announcements</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {meeting.announcements.map((item: unknown, index: number) => (
              <li key={index}>{formatItem(item)}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200">Order of Service</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <strong>Opening Hymn:</strong> #{meeting.openingHymn?.number} — {meeting.openingHymn?.title}
          </li>
          <li>
            <strong>Opening Prayer:</strong> {meeting.openingPrayer}
          </li>

          {Array.isArray(meeting.wardBusiness) ? (
            meeting.wardBusiness.length > 0 && (
              <li>
                <strong>Ward Business:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  {meeting.wardBusiness.map((item: unknown, index: number) => (
                    <li key={index}>{formatItem(item)}</li>
                  ))}
                </ul>
              </li>
            )
          ) : (
            Boolean(meeting.wardBusiness) && (
              <li>
                <strong>Ward Business:</strong> {formatItem(meeting.wardBusiness)}
              </li>
            )
          )}

          {Array.isArray(meeting.stakeBusiness) ? (
            meeting.stakeBusiness.length > 0 && (
              <li>
                <strong>Stake Business:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  {meeting.stakeBusiness.map((item: unknown, index: number) => (
                    <li key={index}>{formatItem(item)}</li>
                  ))}
                </ul>
              </li>
            )
          ) : (
            Boolean(meeting.stakeBusiness) && (
              <li>
                <strong>Stake Business:</strong> {formatItem(meeting.stakeBusiness)}
              </li>
            )
          )}

          <li>
            <strong>Sacrament Hymn:</strong> #{meeting.sacramentHymn?.number} — {meeting.sacramentHymn?.title}
          </li>
        </ul>

        {Array.isArray(meeting.speakers) && meeting.speakers.length > 0 && (
          <div className="pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Speakers
            </h3>
            <ul className="space-y-1.5 text-sm">
              {meeting.speakers.map((speaker: SpeakerItem, index: number) => (
                <li key={index}>
                  <strong>{speaker.name}</strong>
                  {speaker.topic ? ` — ${speaker.topic}` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="space-y-2 text-sm pt-2">
          <li>
            <strong>Closing Hymn:</strong> #{meeting.closingHymn?.number} — {meeting.closingHymn?.title}
          </li>
          <li>
            <strong>Closing Prayer:</strong> {meeting.closingPrayer}
          </li>
        </ul>
      </section>
    </article>
  );
}

export default function MeetingDetailPage(props: MeetingDetailPageProps) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between no-print">
        <Link href="/meetings" className="text-sm font-medium hover:underline">
          ← Back to Meetings
        </Link>
      </div>

      <Suspense
        fallback={<div className="p-8 text-center text-sm text-slate-500">Loading meeting program...</div>}
      >
        <MeetingProgramDetail params={props.params} />
      </Suspense>
    </main>
  );
}