import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Week 05 placeholder: verify session / admin role here before rendering protected admin UI.
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Admin
            </span>
            <Link href="/meetings" className="text-sm font-semibold no-underline">
              Sacrament Meeting Planner
            </Link>
          </div>

          <nav aria-label="Admin navigation" className="flex items-center gap-4 text-sm">
            <Link href="/meetings" className="hover:underline">
              Public View
            </Link>
            <Link href="/meetings/new" className="font-medium hover:underline">
              New Meeting
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}