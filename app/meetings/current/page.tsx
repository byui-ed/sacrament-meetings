import { redirect } from 'next/navigation';
import { getMeetings } from '@/lib/meetings-db';

export default function CurrentMeetingPage() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  const formattedSunday = sunday.toISOString().split('T')[0];
  const meetings = getMeetings(formattedSunday);

  if (meetings.length > 0) {
    redirect(`/meetings/${meetings[0].id}`);
  }

  // Fallback to meetings overview if no meeting found for today's Sunday
  redirect('/meetings');
}