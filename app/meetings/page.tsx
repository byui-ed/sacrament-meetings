import MeetingCard from '@/components/MeetingCard';
import type { SacramentMeeting } from '@/lib/types';

async function getMeetingsFromApi(): Promise<SacramentMeeting[]> {
  // Use absolute URL for server-side fetches in Next.js or fetch locally depending on deployment
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
    : 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/meetings`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch meetings');
  }
  return res.json();
}

export default async function MeetingsListPage() {
  const meetings = await getMeetingsFromApi();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}