import Link from 'next/link';

export default function PublicMeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur no-print">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link
            href="/meetings"
            className="font-semibold text-base tracking-tight text-slate-900 dark:text-slate-100 no-underline"
          >
            Sacrament Meeting Planner
          </Link>

          <nav aria-label="Member meetings navigation" className="flex items-center gap-5 text-sm">
            <Link href="/meetings" className="font-medium hover:opacity-80">
              All Meetings
            </Link>
            <Link href="/meetings/current" className="font-medium hover:opacity-80">
              This Sunday
            </Link>
            <Link
              href="/meetings/new"
              className="text-xs font-medium px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 no-underline hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}