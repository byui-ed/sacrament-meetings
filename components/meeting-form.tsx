'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import type { SacramentMeeting, SpeakerInfo } from '@/lib/meetings-db';
import type { MeetingActionState } from '@/lib/actions';

interface MeetingFormProps {
  actionFn: (
    prevState: MeetingActionState,
    formData: FormData
  ) => Promise<MeetingActionState>;
  initialMeeting?: SacramentMeeting | null;
  submitLabel: string;
  submittingLabel: string;
}

const initialState: MeetingActionState = {
  message: null,
  errors: {},
};

function formatSpeakersDefault(speakers: unknown): string {
  if (!Array.isArray(speakers)) return '';
  return speakers
    .map((item: SpeakerInfo) => {
      if (!item || typeof item !== 'object') return '';
      return item.topic ? `${item.name ?? ''} - ${item.topic}` : String(item.name ?? '');
    })
    .filter(Boolean)
    .join('\n');
}

function formatAnnouncementsDefault(announcements: unknown): string {
  if (!Array.isArray(announcements)) return '';
  return announcements
    .map((item) => (typeof item === 'string' ? item : String(item ?? '')))
    .filter(Boolean)
    .join('\n');
}

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true" className="min-h-5">
      {errors?.map((error) => (
        <p key={error} className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      ))}
    </div>
  );
}

export default function MeetingForm({
  actionFn,
  initialMeeting,
  submitLabel,
  submittingLabel,
}: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(actionFn, initialState);

  const inputClass =
    'block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const labelClass =
    'mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200';

  return (
    <form
      action={formAction}
      noValidate
      className="space-y-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className={labelClass}>
            Meeting Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={initialMeeting?.date ?? ''}
            aria-describedby="date-error"
            className={inputClass}
          />
          <FieldError id="date-error" errors={state.errors?.date} />
        </div>

        <div>
          <label htmlFor="meetingType" className={labelClass}>
            Meeting Type
          </label>
          <input
            id="meetingType"
            name="meetingType"
            type="text"
            placeholder="Sacrament / Fast & Testimony"
            defaultValue={initialMeeting?.meetingType ?? 'Sacrament'}
            aria-describedby="meetingType-error"
            className={inputClass}
          />
          <FieldError id="meetingType-error" errors={state.errors?.meetingType} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="presiding" className={labelClass}>
            Presiding
          </label>
          <input
            id="presiding"
            name="presiding"
            type="text"
            defaultValue={initialMeeting?.presiding ?? ''}
            aria-describedby="presiding-error"
            className={inputClass}
          />
          <FieldError id="presiding-error" errors={state.errors?.presiding} />
        </div>

        <div>
          <label htmlFor="conducting" className={labelClass}>
            Conducting
          </label>
          <input
            id="conducting"
            name="conducting"
            type="text"
            defaultValue={initialMeeting?.conducting ?? ''}
            aria-describedby="conducting-error"
            className={inputClass}
          />
          <FieldError id="conducting-error" errors={state.errors?.conducting} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="openingHymnNumber" className={labelClass}>
            Opening Hymn #
          </label>
          <input
            id="openingHymnNumber"
            name="openingHymnNumber"
            type="text"
            defaultValue={String(initialMeeting?.openingHymn?.number ?? '')}
            aria-describedby="openingHymnNumber-error"
            className={inputClass}
          />
          <FieldError id="openingHymnNumber-error" errors={state.errors?.openingHymnNumber} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="openingHymnTitle" className={labelClass}>
            Opening Hymn Title
          </label>
          <input
            id="openingHymnTitle"
            name="openingHymnTitle"
            type="text"
            defaultValue={initialMeeting?.openingHymn?.title ?? ''}
            aria-describedby="openingHymnTitle-error"
            className={inputClass}
          />
          <FieldError id="openingHymnTitle-error" errors={state.errors?.openingHymnTitle} />
        </div>
      </div>

      <div>
        <label htmlFor="openingPrayer" className={labelClass}>
          Opening Prayer
        </label>
        <input
          id="openingPrayer"
          name="openingPrayer"
          type="text"
          defaultValue={initialMeeting?.openingPrayer ?? ''}
          aria-describedby="openingPrayer-error"
          className={inputClass}
        />
        <FieldError id="openingPrayer-error" errors={state.errors?.openingPrayer} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="sacramentHymnNumber" className={labelClass}>
            Sacrament Hymn #
          </label>
          <input
            id="sacramentHymnNumber"
            name="sacramentHymnNumber"
            type="text"
            defaultValue={String(initialMeeting?.sacramentHymn?.number ?? '')}
            aria-describedby="sacramentHymnNumber-error"
            className={inputClass}
          />
          <FieldError id="sacramentHymnNumber-error" errors={state.errors?.sacramentHymnNumber} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="sacramentHymnTitle" className={labelClass}>
            Sacrament Hymn Title
          </label>
          <input
            id="sacramentHymnTitle"
            name="sacramentHymnTitle"
            type="text"
            defaultValue={initialMeeting?.sacramentHymn?.title ?? ''}
            aria-describedby="sacramentHymnTitle-error"
            className={inputClass}
          />
          <FieldError id="sacramentHymnTitle-error" errors={state.errors?.sacramentHymnTitle} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="closingHymnNumber" className={labelClass}>
            Closing Hymn #
          </label>
          <input
            id="closingHymnNumber"
            name="closingHymnNumber"
            type="text"
            defaultValue={String(initialMeeting?.closingHymn?.number ?? '')}
            aria-describedby="closingHymnNumber-error"
            className={inputClass}
          />
          <FieldError id="closingHymnNumber-error" errors={state.errors?.closingHymnNumber} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="closingHymnTitle" className={labelClass}>
            Closing Hymn Title
          </label>
          <input
            id="closingHymnTitle"
            name="closingHymnTitle"
            type="text"
            defaultValue={initialMeeting?.closingHymn?.title ?? ''}
            aria-describedby="closingHymnTitle-error"
            className={inputClass}
          />
          <FieldError id="closingHymnTitle-error" errors={state.errors?.closingHymnTitle} />
        </div>
      </div>

      <div>
        <label htmlFor="closingPrayer" className={labelClass}>
          Closing Prayer
        </label>
        <input
          id="closingPrayer"
          name="closingPrayer"
          type="text"
          defaultValue={initialMeeting?.closingPrayer ?? ''}
          aria-describedby="closingPrayer-error"
          className={inputClass}
        />
        <FieldError id="closingPrayer-error" errors={state.errors?.closingPrayer} />
      </div>

      <div>
        <label htmlFor="speakersText" className={labelClass}>
          Speakers (one per line, optional: Name - Topic)
        </label>
        <textarea
          id="speakersText"
          name="speakersText"
          rows={3}
          defaultValue={formatSpeakersDefault(initialMeeting?.speakers)}
          aria-describedby="speakersText-error"
          className={inputClass}
        />
        <FieldError id="speakersText-error" errors={state.errors?.speakersText} />
      </div>

      <div>
        <label htmlFor="announcementsText" className={labelClass}>
          Announcements (one per line, optional)
        </label>
        <textarea
          id="announcementsText"
          name="announcementsText"
          rows={3}
          defaultValue={formatAnnouncementsDefault(initialMeeting?.announcements)}
          aria-describedby="announcementsText-error"
          className={inputClass}
        />
        <FieldError id="announcementsText-error" errors={state.errors?.announcementsText} />
      </div>

      <div id="form-status" aria-live="polite" aria-atomic="true">
        {state.message ? (
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60 cursor-pointer"
        >
          {isPending ? submittingLabel : submitLabel}
        </button>
        <Link
          href="/meetings"
          className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}