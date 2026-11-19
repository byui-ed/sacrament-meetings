export default function MeetingsLoading() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-56 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-4 w-80 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>

      <div className="h-10 w-full max-w-md rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 animate-pulse p-5"
          />
        ))}
      </div>
    </main>
  );
}