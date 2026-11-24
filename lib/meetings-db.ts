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

export interface MeetingMutationInput {
  date: string;
  meetingType: string;
  presiding: string;
  conducting: string;
  openingHymnNumber: string;
  openingHymnTitle: string;
  openingPrayer: string;
  sacramentHymnNumber: string;
  sacramentHymnTitle: string;
  closingHymnNumber: string;
  closingHymnTitle: string;
  closingPrayer: string;
  speakersText: string;
  announcementsText: string;
}

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  return neon(connectionString);
}

function parseSpeakers(raw: string): SpeakerInfo[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [namePart, ...topicParts] = line.split(' - ');
      const topic = topicParts.join(' - ').trim();
      return topic
        ? { name: namePart.trim(), topic }
        : { name: namePart.trim() };
    });
}

function parseLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function getMeetings(searchQuery = ''): Promise<SacramentMeeting[]> {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing in environment variables.');
    return [];
  }

  const sql = getSql();
  const trimmed = searchQuery.trim();

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

  return rows.length === 0 ? null : (rows[0] as SacramentMeeting);
}

export async function createMeetingRecord(input: MeetingMutationInput): Promise<void> {
  const sql = getSql();
  const openingHymn = JSON.stringify({
    number: input.openingHymnNumber,
    title: input.openingHymnTitle,
  });
  const sacramentHymn = JSON.stringify({
    number: input.sacramentHymnNumber,
    title: input.sacramentHymnTitle,
  });
  const closingHymn = JSON.stringify({
    number: input.closingHymnNumber,
    title: input.closingHymnTitle,
  });
  const speakers = JSON.stringify(parseSpeakers(input.speakersText));
  const announcements = JSON.stringify(parseLines(input.announcementsText));

  await sql`
    INSERT INTO meetings (
      date,
      meeting_type,
      presiding,
      conducting,
      opening_hymn,
      opening_prayer,
      sacrament_hymn,
      closing_hymn,
      closing_prayer,
      speakers,
      announcements
    )
    VALUES (
      ${input.date}::date,
      ${input.meetingType},
      ${input.presiding},
      ${input.conducting},
      ${openingHymn}::jsonb,
      ${input.openingPrayer},
      ${sacramentHymn}::jsonb,
      ${closingHymn}::jsonb,
      ${input.closingPrayer},
      ${speakers}::jsonb,
      ${announcements}::jsonb
    )
  `;
}

export async function updateMeetingRecord(
  id: number,
  input: MeetingMutationInput
): Promise<boolean> {
  if (!Number.isInteger(id) || id <= 0) {
    return false;
  }

  const sql = getSql();
  const openingHymn = JSON.stringify({
    number: input.openingHymnNumber,
    title: input.openingHymnTitle,
  });
  const sacramentHymn = JSON.stringify({
    number: input.sacramentHymnNumber,
    title: input.sacramentHymnTitle,
  });
  const closingHymn = JSON.stringify({
    number: input.closingHymnNumber,
    title: input.closingHymnTitle,
  });
  const speakers = JSON.stringify(parseSpeakers(input.speakersText));
  const announcements = JSON.stringify(parseLines(input.announcementsText));

  const updated = await sql`
    UPDATE meetings
    SET
      date = ${input.date}::date,
      meeting_type = ${input.meetingType},
      presiding = ${input.presiding},
      conducting = ${input.conducting},
      opening_hymn = ${openingHymn}::jsonb,
      opening_prayer = ${input.openingPrayer},
      sacrament_hymn = ${sacramentHymn}::jsonb,
      closing_hymn = ${closingHymn}::jsonb,
      closing_prayer = ${input.closingPrayer},
      speakers = ${speakers}::jsonb,
      announcements = ${announcements}::jsonb
    WHERE id = ${id}
    RETURNING id
  `;

  return updated.length > 0;
}

export async function deleteMeetingRecord(id: number): Promise<void> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid meeting ID.');
  }

  const sql = getSql();
  await sql`
    DELETE FROM meetings
    WHERE id = ${id}
  `;
}