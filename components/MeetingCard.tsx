import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const formattedDate = new Date(`${meeting.date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {meeting.meetingType}
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{formattedDate}</span>
        </div>
        <h3 className="text-lg font-bold mb-2">Sacrament Meeting Program</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Presiding: <span className="font-medium text-gray-900 dark:text-gray-100">{meeting.presiding}</span> &bull; 
          Conducting: <span className="font-medium text-gray-900 dark:text-gray-100">{meeting.conducting}</span>
        </p>
      </div>
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {meeting.speakers.length} Speaker(s) / Item(s)
        </span>
        <Link
          href={`/meetings/${meeting.id}`}
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View Program &rarr;
        </Link>
      </div>
    </div>
  );
}