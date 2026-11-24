import Link from 'next/link';

export default function MeetingEditNotFound() {
  return (
    <main className="mx-auto mt-16 max-w-xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-sm space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Meeting not found
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        The meeting you tried to edit does not exist or may have been removed.
      </p>
      <div className="pt-2">
        <Link
          href="/meetings"
          className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Back to Meetings
        </Link>
      </div>
    </main>
  );
}