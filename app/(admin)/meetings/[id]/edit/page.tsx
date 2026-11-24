import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMeetingById } from '@/lib/meetings-db';
import { updateMeeting } from '@/lib/actions';
import MeetingForm from '@/components/meeting-form';

interface EditMeetingPageProps {
  params: Promise<{ id: string }>;
}

async function EditMeetingContent({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const numericId = Number(rawId);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const meeting = await getMeetingById(numericId);
  if (!meeting) {
    notFound();
  }

  const updateMeetingWithId = updateMeeting.bind(null, String(meeting.id));

  return (
    <MeetingForm
      actionFn={updateMeetingWithId}
      initialMeeting={meeting}
      submitLabel="Update Meeting"
      submittingLabel="Updating..."
    />
  );
}

export default function EditMeetingPage(props: EditMeetingPageProps) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Sacrament Meeting</h1>
          <p className="text-sm text-slate-500">
            Update meeting program details with server validation.
          </p>
        </div>
        <Link href="/meetings" className="text-sm font-medium hover:underline">
          ← Back to Meetings
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="p-6 text-sm text-slate-500">Loading meeting details...</div>
        }
      >
        <EditMeetingContent params={props.params} />
      </Suspense>
    </main>
  );
}