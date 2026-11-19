import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const dateParam = request.nextUrl.searchParams.get('date');

    if (dateParam) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        return NextResponse.json(
          { error: 'Invalid date format. Expected YYYY-MM-DD.' },
          { status: 400 }
        );
      }

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
        WHERE to_char(date, 'YYYY-MM-DD') = ${dateParam}
        ORDER BY date DESC, id DESC
      `;

      return NextResponse.json(rows, { status: 200 });
    }

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

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('GET /api/meetings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sacrament meetings.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.date || !body?.presiding || !body?.conducting) {
      return NextResponse.json(
        { error: 'Missing required fields: date, presiding, and conducting are required.' },
        { status: 400 }
      );
    }

    const inserted = await sql`
      INSERT INTO meetings (
        date,
        meeting_type,
        presiding,
        conducting,
        opening_hymn,
        opening_prayer,
        sacrament_hymn,
        closing_hymn,
        closing_prayer
      )
      VALUES (
        ${body.date}::date,
        ${body.meetingType ?? 'Regular'},
        ${body.presiding},
        ${body.conducting},
        ${body.openingHymn ? JSON.stringify(body.openingHymn) : null}::jsonb,
        ${body.openingPrayer ?? null},
        ${body.sacramentHymn ? JSON.stringify(body.sacramentHymn) : null}::jsonb,
        ${body.closingHymn ? JSON.stringify(body.closingHymn) : null}::jsonb,
        ${body.closingPrayer ?? null}
      )
      RETURNING id, to_char(date, 'YYYY-MM-DD') AS "date"
    `;

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/meetings error:', error);
    return NextResponse.json(
      { error: 'Failed to create sacrament meeting.' },
      { status: 500 }
    );
  }
}