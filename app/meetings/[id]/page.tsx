import MeetingDetail from '@/components/MeetingDetail';
import type { SacramentMeeting } from '@/lib/types';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getMeetingFromApi(id: string): Promise<SacramentMeeting | null> {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
    : 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/meetings/${id}`, { cache: 'no-store' });
  
  if (res.status === 404 || res.status === 400) {
    return null;
  }
  
  if (!res.ok) {
    throw new Error('Failed to fetch meeting');
  }
  
  return res.json();
}

export default async function MeetingDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const meeting = await getMeetingFromApi(resolvedParams.id);

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}