import type { SacramentMeeting } from '@/lib/types';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const formattedDate = new Date(`${meeting.date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-3xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm print:shadow-none print:border-none">
      <div className="text-center border-b border-gray-200 dark:border-gray-800 pb-6 mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight mb-1">Riverside Ward Sacrament Meeting</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
        <div className="mt-2 inline-block text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          {meeting.meetingType} meeting
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
        <div>
          <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase">Presiding</span>
          <span className="font-semibold">{meeting.presiding}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase">Conducting</span>
          <span className="font-semibold">{meeting.conducting}</span>
        </div>
      </div>

      {meeting.announcements && meeting.announcements.length > 0 && (
        <section className="mb-8 p-4 border border-blue-100 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/50 rounded-xl">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 text-sm uppercase tracking-wide">Announcements</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
            {meeting.announcements.map((announcement, idx) => (
              <li key={idx}>{announcement}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="space-y-6 text-sm">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
          <span className="font-medium text-gray-500 dark:text-gray-400">Opening Hymn (No. {meeting.openingHymn.number})</span>
          <span className="font-bold">{meeting.openingHymn.title}</span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
          <span className="font-medium text-gray-500 dark:text-gray-400">Opening Prayer</span>
          <span className="font-semibold">{meeting.openingPrayer}</span>
        </div>

        {meeting.wardBusiness.length > 0 && (
          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="font-medium text-gray-500 dark:text-gray-400 block mb-1">Ward Business</span>
            <ul className="space-y-1">
              {meeting.wardBusiness.map((item, idx) => (
                <li key={idx} className="font-semibold">{item.description}</li>
              ))}
            </ul>
          </div>
        )}

        {meeting.stakeBusiness && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-amber-800 dark:text-amber-300 font-medium text-xs">
            Stake Business is scheduled for this meeting.
          </div>
        )}

        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
          <span className="font-medium text-gray-500 dark:text-gray-400">Sacrament Hymn (No. {meeting.sacramentHymn.number})</span>
          <span className="font-bold">{meeting.sacramentHymn.title}</span>
        </div>

        <div className="text-center py-2 text-xs uppercase tracking-widest font-semibold text-gray-400 border-y border-gray-100 dark:border-gray-800">
          Administration of the Sacrament
        </div>

        {meeting.speakers.length > 0 && (
          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="font-medium text-gray-500 dark:text-gray-400 block mb-2">Speakers & Musical Numbers</span>
            <div className="space-y-2">
              {meeting.speakers.map((speaker, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
                  <span className="font-semibold">{speaker.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 italic">
                    {speaker.type === 'musical-number' ? 'Musical Number' : speaker.topic}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
          <span className="font-medium text-gray-500 dark:text-gray-400">Closing Hymn (No. {meeting.closingHymn.number})</span>
          <span className="font-bold">{meeting.closingHymn.title}</span>
        </div>

        <div className="flex justify-between items-center pb-2">
          <span className="font-medium text-gray-500 dark:text-gray-400">Closing Prayer</span>
          <span className="font-semibold">{meeting.closingPrayer}</span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Print Program
        </button>
      </div>
    </article>
  );
}