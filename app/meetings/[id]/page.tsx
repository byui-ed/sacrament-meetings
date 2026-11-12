import MeetingDetail from '@/components/MeetingDetail';
import { getMeetingById } from '@/lib/meetings-db';
import { notFound } from 'next/navigation';

// Allow blocking route for dynamic params
export const instant = false;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const meetingId = parseInt(resolvedParams.id, 10);

  if (isNaN(meetingId)) {
    notFound();
  }

  const meeting = getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}