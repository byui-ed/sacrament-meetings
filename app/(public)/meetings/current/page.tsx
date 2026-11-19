import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

function getThisSundayIsoDate(referenceDate: Date): string {
  const dayOfWeek = referenceDate.getDay(); // 0 = Sunday
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  const sunday = new Date(referenceDate);
  sunday.setDate(referenceDate.getDate() + daysUntilSunday);

  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, '0');
  const day = String(sunday.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default async function CurrentSundayRedirectPage() {
  await connection();

  const targetSunday = getThisSundayIsoDate(new Date());
  let meetingId: number | null = null;

  try {
    const exactRows = await sql`
      SELECT id
      FROM meetings
      WHERE to_char(date, 'YYYY-MM-DD') = ${targetSunday}
      LIMIT 1
    `;

    if (exactRows.length > 0) {
      meetingId = Number(exactRows[0].id);
    } else {
      const closestRows = await sql`
        SELECT id
        FROM meetings
        ORDER BY ABS(date - ${targetSunday}::date) ASC, date DESC
        LIMIT 1
      `;

      if (closestRows.length > 0) {
        meetingId = Number(closestRows[0].id);
      }
    }
  } catch (error) {
    console.error('Failed to resolve current Sunday meeting:', error);
  }

  if (meetingId !== null && Number.isInteger(meetingId) && meetingId > 0) {
    redirect(`/meetings/${meetingId}`);
  }

  redirect('/meetings');
}