import { redirect } from 'next/navigation';
import { getMeetings } from '@/lib/meetings-db';
import { connection } from 'next/server';

export default async function CurrentMeetingPage() {
  // Opt into dynamic rendering safely without conflicting with cacheComponents
  await connection();

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) through 6 (Sat)
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek); // roll back to Sunday

  // Format as 'YYYY-MM-DD'
  const formattedDate = sunday.toISOString().split('T')[0];

  // Query meetings for this Sunday
  const meetings = getMeetings(formattedDate);
  const currentMeeting = meetings.length > 0 ? meetings[0] : null;

  if (currentMeeting) {
    redirect(`/meetings/${currentMeeting.id}`);
  } else {
    // Fallback to meetings list if no meeting exists for today
    redirect('/meetings');
  }
}