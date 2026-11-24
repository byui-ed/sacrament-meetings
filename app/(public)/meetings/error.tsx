'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function MeetingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Meetings route error:', error);
  }, [error]);

  return (
    <main className="mx-auto mt-16 max-w-xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-sm space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Something went wrong
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {error.message || 'An unexpected error occurred while loading or saving meetings.'}
      </p>
      <div className="pt-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/meetings"
          className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Back to Meetings
        </Link>
      </div>
    </main>
  );
}