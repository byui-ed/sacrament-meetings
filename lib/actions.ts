'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createMeetingRecord,
  updateMeetingRecord,
  deleteMeetingRecord,
} from '@/lib/meetings-db';

const MeetingFormSchema = z.object({
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid meeting date (YYYY-MM-DD).'),
  meetingType: z
    .string()
    .trim()
    .min(2, 'Meeting type is required (at least 2 characters).'),
  presiding: z
    .string()
    .trim()
    .min(2, 'Presiding leader name must be at least 2 characters.'),
  conducting: z
    .string()
    .trim()
    .min(2, 'Conducting leader name must be at least 2 characters.'),
  openingHymnNumber: z
    .string()
    .trim()
    .min(1, 'Opening hymn number is required.'),
  openingHymnTitle: z
    .string()
    .trim()
    .min(2, 'Opening hymn title must be at least 2 characters.'),
  openingPrayer: z
    .string()
    .trim()
    .min(2, 'Opening prayer name must be at least 2 characters.'),
  sacramentHymnNumber: z
    .string()
    .trim()
    .min(1, 'Sacrament hymn number is required.'),
  sacramentHymnTitle: z
    .string()
    .trim()
    .min(2, 'Sacrament hymn title must be at least 2 characters.'),
  closingHymnNumber: z
    .string()
    .trim()
    .min(1, 'Closing hymn number is required.'),
  closingHymnTitle: z
    .string()
    .trim()
    .min(2, 'Closing hymn title must be at least 2 characters.'),
  closingPrayer: z
    .string()
    .trim()
    .min(2, 'Closing prayer name must be at least 2 characters.'),
  speakersText: z.string().optional().default(''),
  announcementsText: z.string().optional().default(''),
});

export type MeetingActionState = {
  errors?: {
    date?: string[];
    meetingType?: string[];
    presiding?: string[];
    conducting?: string[];
    openingHymnNumber?: string[];
    openingHymnTitle?: string[];
    openingPrayer?: string[];
    sacramentHymnNumber?: string[];
    sacramentHymnTitle?: string[];
    closingHymnNumber?: string[];
    closingHymnTitle?: string[];
    closingPrayer?: string[];
    speakersText?: string[];
    announcementsText?: string[];
  };
  message?: string | null;
};

function extractFormInput(formData: FormData) {
  return {
    date: formData.get('date'),
    meetingType: formData.get('meetingType'),
    presiding: formData.get('presiding'),
    conducting: formData.get('conducting'),
    openingHymnNumber: formData.get('openingHymnNumber'),
    openingHymnTitle: formData.get('openingHymnTitle'),
    openingPrayer: formData.get('openingPrayer'),
    sacramentHymnNumber: formData.get('sacramentHymnNumber'),
    sacramentHymnTitle: formData.get('sacramentHymnTitle'),
    closingHymnNumber: formData.get('closingHymnNumber'),
    closingHymnTitle: formData.get('closingHymnTitle'),
    closingPrayer: formData.get('closingPrayer'),
    speakersText: formData.get('speakersText') ?? '',
    announcementsText: formData.get('announcementsText') ?? '',
  };
}

export async function createMeeting(
  _prevState: MeetingActionState,
  formData: FormData
): Promise<MeetingActionState> {
  const parsed = MeetingFormSchema.safeParse(extractFormInput(formData));

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the highlighted fields before saving the meeting.',
    };
  }

  try {
    await createMeetingRecord(parsed.data);
    revalidatePath('/meetings');
  } catch (error) {
    console.error('Failed to create meeting:', error);
    throw new Error('Unable to save new meeting. Please try again later.');
  }

  redirect('/meetings');
}

export async function updateMeeting(
  id: string,
  _prevState: MeetingActionState,
  formData: FormData
): Promise<MeetingActionState> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return {
      message: 'Invalid meeting ID.',
    };
  }

  const parsed = MeetingFormSchema.safeParse(extractFormInput(formData));

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the highlighted fields before updating the meeting.',
    };
  }

  try {
    const updated = await updateMeetingRecord(numericId, parsed.data);
    if (!updated) {
      return {
        message: 'Meeting record could not be found to update.',
      };
    }
    revalidatePath('/meetings');
    revalidatePath(`/meetings/${numericId}`);
    revalidatePath(`/meetings/${numericId}/edit`);
  } catch (error) {
    console.error(`Failed to update meeting ${id}:`, error);
    throw new Error('Unable to update meeting. Please try again later.');
  }

  redirect('/meetings');
}

export async function deleteMeeting(id: string): Promise<void> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error('Invalid meeting ID.');
  }

  try {
    await deleteMeetingRecord(numericId);
    revalidatePath('/meetings');
  } catch (error) {
    console.error(`Failed to delete meeting ${id}:`, error);
    throw new Error('Unable to delete meeting. Please try again later.');
  }
}