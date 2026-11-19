'use client';

import { Suspense, useEffect, useState, FormEvent, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

function EditMeetingForm({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState('');
  const [meetingType, setMeetingType] = useState('Regular');
  const [presiding, setPresiding] = useState('');
  const [conducting, setConducting] = useState('');
  const [openingPrayer, setOpeningPrayer] = useState('');
  const [closingPrayer, setClosingPrayer] = useState('');

  useEffect(() => {
    let active = true;

    async function loadMeeting() {
      try {
        const res = await fetch(`/api/meetings/${rawId}`);
        if (!res.ok) {
          if (active) {
            setError('Could not load meeting details.');
            setLoading(false);
          }
          return;
        }
        const meeting = await res.json();
        if (active) {
          setDate(meeting.date ?? '');
          setMeetingType(meeting.meetingType ?? 'Regular');
          setPresiding(meeting.presiding ?? '');
          setConducting(meeting.conducting ?? '');
          setOpeningPrayer(meeting.openingPrayer ?? '');
          setClosingPrayer(meeting.closingPrayer ?? '');
          setLoading(false);
        }
      } catch {
        if (active) {
          setError('Network error loading meeting.');
          setLoading(false);
        }
      }
    }

    loadMeeting();
    return () => {
      active = false;
    };
  }, [rawId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/meetings/${rawId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          meetingType,
          presiding,
          conducting,
          openingPrayer,
          closingPrayer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update meeting.');
        setSaving(false);
        return;
      }

      router.push(`/meetings/${rawId}`);
      router.refresh();
    } catch {
      setError('Network error while saving changes.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="py-4 text-sm text-slate-500">
        Loading meeting editor...
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Sacrament Meeting</h1>
          <p className="text-sm text-slate-500">Update program details for meeting #{rawId}.</p>
        </div>
        <Link href={`/meetings/${rawId}`} className="text-sm hover:underline">
          Back to Program
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/50 p-3.5 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="edit-date" className="block text-sm font-medium">
              Date
            </label>
            <input
              id="edit-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-type" className="block text-sm font-medium">
              Meeting Type
            </label>
            <input
              id="edit-type"
              type="text"
              required
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="edit-presiding" className="block text-sm font-medium">
              Presiding
            </label>
            <input
              id="edit-presiding"
              type="text"
              required
              value={presiding}
              onChange={(e) => setPresiding(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-conducting" className="block text-sm font-medium">
              Conducting
            </label>
            <input
              id="edit-conducting"
              type="text"
              required
              value={conducting}
              onChange={(e) => setConducting(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="edit-opening-prayer" className="block text-sm font-medium">
              Opening Prayer
            </label>
            <input
              id="edit-opening-prayer"
              type="text"
              value={openingPrayer}
              onChange={(e) => setOpeningPrayer(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-closing-prayer" className="block text-sm font-medium">
              Closing Prayer
            </label>
            <input
              id="edit-closing-prayer"
              type="text"
              value={closingPrayer}
              onChange={(e) => setClosingPrayer(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </>
  );
}

export default function EditMeetingPage(props: EditPageProps) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading meeting editor...</div>}>
        <EditMeetingForm params={props.params} />
      </Suspense>
    </main>
  );
}