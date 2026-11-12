'use client';

import type { SacramentMeeting } from '@/lib/types';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow rounded-lg my-6 print:shadow-none print:m-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-2xl font-bold text-gray-900">Meeting Program</h2>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Print Program
        </button>
      </div>

      {/* Render meeting agenda details here... */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold capitalize">{meeting.meetingType} Meeting - {meeting.date}</h3>
        <p><strong>Presiding:</strong> {meeting.presiding}</p>
        <p><strong>Conducting:</strong> {meeting.conducting}</p>
        {/* Add remaining fields as needed */}
      </div>
    </div>
  );
}