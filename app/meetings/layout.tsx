import Link from 'next/link';

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Meeting Programs</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View schedules, agendas, and print Sunday programs.</p>
        </div>
        <nav className="flex gap-3 text-sm">
          <Link href="/meetings" className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
            All Meetings
          </Link>
          <Link href="/meetings/current" className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
            Current Sunday
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}