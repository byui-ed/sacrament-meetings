import Link from 'next/link';
import { createMeeting } from '@/lib/actions';
import MeetingForm from '@/components/meeting-form';

export default function CreateMeetingPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">New Sacrament Meeting</h1>
          <p className="text-sm text-slate-500">
            Enter program details and validate fields before saving.
          </p>
        </div>
        <Link href="/meetings" className="text-sm font-medium hover:underline">
          ← Back to Meetings
        </Link>
      </div>

      <MeetingForm
        actionFn={createMeeting}
        submitLabel="Create Meeting"
        submittingLabel="Saving..."
      />
    </main>
  );
}