import { neon } from '@neondatabase/serverless';

export interface HymnInfo {
  number?: number | string;
  title?: string;
}

export interface SpeakerInfo {
  name?: string;
  topic?: string;
}

export interface SacramentMeeting {
  id: number;
  date: string;
  meetingType: string;
  presiding: string;
  conducting: string;
  openingHymn?: HymnInfo | null;
  openingPrayer?: string | null;
  sacramentHymn?: HymnInfo | null;
  closingHymn?: HymnInfo | null;
  closingPrayer?: string | null;
  wardBusiness?: unknown;
  stakeBusiness?: unknown;
  announcements?: unknown;
  speakers?: SpeakerInfo[] | null;
}

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  return neon(connectionString);
}

export async function getMeetings(searchQuery = ''): Promise<SacramentMeeting[]> {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing in environment variables.');
    return [];
  }

  const sql = getSql();
  const trimmed = searchQuery.trim();

  try {
    if (!trimmed) {
      const rows = await sql`
        SELECT
          id,
          to_char(date, 'YYYY-MM-DD') AS "date",
          meeting_type AS "meetingType",
          presiding,
          conducting,
          opening_hymn AS "openingHymn",
          opening_prayer AS "openingPrayer",
          sacrament_hymn AS "sacramentHymn",
          closing_hymn AS "closingHymn",
          closing_prayer AS "closingPrayer",
          ward_business AS "wardBusiness",
          stake_business AS "stakeBusiness",
          announcements,
          speakers
        FROM meetings
        ORDER BY date DESC, id DESC
      `;

      return rows as SacramentMeeting[];
    }

    const pattern = `%${trimmed}%`;
    const rows = await sql`
      SELECT
        id,
        to_char(date, 'YYYY-MM-DD') AS "date",
        meeting_type AS "meetingType",
        presiding,
        conducting,
        opening_hymn AS "openingHymn",
        opening_prayer AS "openingPrayer",
        sacrament_hymn AS "sacramentHymn",
        closing_hymn AS "closingHymn",
        closing_prayer AS "closingPrayer",
        ward_business AS "wardBusiness",
        stake_business AS "stakeBusiness",
        announcements,
        speakers
      FROM meetings
      WHERE
        presiding ILIKE ${pattern}
        OR conducting ILIKE ${pattern}
        OR meeting_type ILIKE ${pattern}
        OR COALESCE(opening_prayer, '') ILIKE ${pattern}
        OR COALESCE(closing_prayer, '') ILIKE ${pattern}
        OR to_char(date, 'YYYY-MM-DD') ILIKE ${pattern}
      ORDER BY date DESC, id DESC
    `;

    return rows as SacramentMeeting[];
  } catch (error) {
    const err = error as { message?: string; cause?: unknown };
    console.error('Error connecting to database in getMeetings:', err.message, err.cause ?? '');
    throw error;
  }
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing in environment variables.');
    return null;
  }

  const sql = getSql();

  try {
    const rows = await sql`
      SELECT
        id,
        to_char(date, 'YYYY-MM-DD') AS "date",
        meeting_type AS "meetingType",
        presiding,
        conducting,
        opening_hymn AS "openingHymn",
        opening_prayer AS "openingPrayer",
        sacrament_hymn AS "sacramentHymn",
        closing_hymn AS "closingHymn",
        closing_prayer AS "closingPrayer",
        ward_business AS "wardBusiness",
        stake_business AS "stakeBusiness",
        announcements,
        speakers
      FROM meetings
      WHERE id = ${id}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as SacramentMeeting;
  } catch (error) {
    const err = error as { message?: string; cause?: unknown };
    console.error('Error connecting to database in getMeetingById:', err.message, err.cause ?? '');
    throw error;
  }
}