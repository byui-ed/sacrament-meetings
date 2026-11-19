import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

interface RouteContext {
  params: Promise<{ id: string }>;
}

function parseMeetingId(rawId: string): number | null {
  if (!/^\d+$/.test(rawId)) {
    return null;
  }
  const num = Number(rawId);
  return Number.isSafeInteger(num) && num > 0 ? num : null;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseMeetingId(rawId);

  if (!id) {
    return NextResponse.json(
      { error: 'Invalid meeting ID. Expected a positive integer.' },
      { status: 400 }
    );
  }

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
      return NextResponse.json({ error: 'Meeting not found.' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error(`GET /api/meetings/${rawId} error:`, error);
    return NextResponse.json(
      { error: 'Failed to retrieve meeting.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseMeetingId(rawId);

  if (!id) {
    return NextResponse.json(
      { error: 'Invalid meeting ID. Expected a positive integer.' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    const updated = await sql`
      UPDATE meetings
      SET
        date = COALESCE(${body.date ?? null}::date, date),
        meeting_type = COALESCE(${body.meetingType ?? null}, meeting_type),
        presiding = COALESCE(${body.presiding ?? null}, presiding),
        conducting = COALESCE(${body.conducting ?? null}, conducting),
        opening_prayer = COALESCE(${body.openingPrayer ?? null}, opening_prayer),
        closing_prayer = COALESCE(${body.closingPrayer ?? null}, closing_prayer)
      WHERE id = ${id}
      RETURNING id, to_char(date, 'YYYY-MM-DD') AS "date"
    `;

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Meeting not found.' }, { status: 404 });
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error(`PUT /api/meetings/${rawId} error:`, error);
    return NextResponse.json(
      { error: 'Failed to update meeting.' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseMeetingId(rawId);

  if (!id) {
    return NextResponse.json(
      { error: 'Invalid meeting ID. Expected a positive integer.' },
      { status: 400 }
    );
  }

  try {
    const deleted = await sql`
      DELETE FROM meetings
      WHERE id = ${id}
      RETURNING id
    `;

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Meeting not found.' }, { status: 404 });
    }

    return NextResponse.json({ deleted: true, id: deleted[0].id }, { status: 200 });
  } catch (error) {
    console.error(`DELETE /api/meetings/${rawId} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete meeting.' },
      { status: 500 }
    );
  }
}