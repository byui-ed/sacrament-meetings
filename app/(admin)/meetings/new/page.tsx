'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewMeetingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState('');
  const [meetingType, setMeetingType] = useState('Regular');
  const [presiding, setPresiding] = useState('');
  const [conducting, setConducting] = useState('');
  const [openingHymnNumber, setOpeningHymnNumber] = useState('');
  const [openingHymnTitle, setOpeningHymnTitle] = useState('');
  const [openingPrayer, setOpeningPrayer] = useState('');
  const [sacramentHymnNumber, setSacramentHymnNumber] = useState('');
  const [sacramentHymnTitle, setSacramentHymnTitle] = useState('');
  const [closingHymnNumber, setClosingHymnNumber] = useState('');
  const [closingHymnTitle, setClosingHymnTitle] = useState('');
  const [closingPrayer, setClosingPrayer] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          meetingType,
          presiding,
          conducting,
          openingHymn: {
            number: Number(openingHymnNumber) || 0,
            title: openingHymnTitle,
          },
          openingPrayer,
          sacramentHymn: {
            number: Number(sacramentHymnNumber) || 0,
            title: sacramentHymnTitle,
          },
          closingHymn: {
            number: Number(closingHymnNumber) || 0,
            title: closingHymnTitle,
          },
          closingPrayer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create sacrament meeting.');
        setSubmitting(false);
        return;
      }

      router.push(`/meetings/${data.id ?? ''}`);
      router.refresh();
    } catch {
      setError('Network error while creating meeting.');
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Create Sacrament Meeting</h1>
          <p className="text-sm text-slate-500">Add a new Sunday program to the database.</p>
        </div>
        <Link href="/meetings" className="text-sm hover:underline">
          Cancel
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
            <label htmlFor="date" className="block text-sm font-medium">
              Meeting Date (YYYY-MM-DD)
            </label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="meetingType" className="block text-sm font-medium">
              Meeting Type
            </label>
            <select
              id="meetingType"
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
            >
              <option value="Regular">Regular</option>
              <option value="Fast and Testimony">Fast and Testimony</option>
              <option value="Stake Conference">Stake Conference</option>
              <option value="Ward Conference">Ward Conference</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="presiding" className="block text-sm font-medium">
              Presiding
            </label>
            <input
              id="presiding"
              type="text"
              required
              value={presiding}
              onChange={(e) => setPresiding(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="conducting" className="block text-sm font-medium">
              Conducting
            </label>
            <input
              id="conducting"
              type="text"
              required
              value={conducting}
              onChange={(e) => setConducting(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label htmlFor="openingHymnNum" className="block text-sm font-medium">
              Opening Hymn #
            </label>
            <input
              id="openingHymnNum"
              type="number"
              min={1}
              value={openingHymnNumber}
              onChange={(e) => setOpeningHymnNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label htmlFor="openingHymnTitle" className="block text-sm font-medium">
              Opening Hymn Title
            </label>
            <input
              id="openingHymnTitle"
              type="text"
              value={openingHymnTitle}
              onChange={(e) => setOpeningHymnTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="openingPrayer" className="block text-sm font-medium">
            Opening Prayer
          </label>
          <input
            id="openingPrayer"
            type="text"
            value={openingPrayer}
            onChange={(e) => setOpeningPrayer(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label htmlFor="sacramentHymnNum" className="block text-sm font-medium">
              Sacrament Hymn #
            </label>
            <input
              id="sacramentHymnNum"
              type="number"
              min={1}
              value={sacramentHymnNumber}
              onChange={(e) => setSacramentHymnNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label htmlFor="sacramentHymnTitle" className="block text-sm font-medium">
              Sacrament Hymn Title
            </label>
            <input
              id="sacramentHymnTitle"
              type="text"
              value={sacramentHymnTitle}
              onChange={(e) => setSacramentHymnTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label htmlFor="closingHymnNum" className="block text-sm font-medium">
              Closing Hymn #
            </label>
            <input
              id="closingHymnNum"
              type="number"
              min={1}
              value={closingHymnNumber}
              onChange={(e) => setClosingHymnNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label htmlFor="closingHymnTitle" className="block text-sm font-medium">
              Closing Hymn Title
            </label>
            <input
              id="closingHymnTitle"
              type="text"
              value={closingHymnTitle}
              onChange={(e) => setClosingHymnTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="closingPrayer" className="block text-sm font-medium">
            Closing Prayer
          </label>
          <input
            id="closingPrayer"
            type="text"
            value={closingPrayer}
            onChange={(e) => setClosingPrayer(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Saving...' : 'Save Meeting'}
          </button>
        </div>
      </form>
    </main>
  );
}