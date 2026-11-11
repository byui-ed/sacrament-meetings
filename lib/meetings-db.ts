import type { SacramentMeeting } from './types';

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-05-03',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Williams',
    wardBusiness: [{ description: 'Sustaining of new Primary president' }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "In Remembrance of Thy Suffering" },
    speakers: [
      { name: 'Sister Brown', topic: 'Faith in Jesus Christ', type: 'speaker' },
      { name: 'Youth Choir', topic: '', type: 'musical-number' }
    ],
    closingHymn: { number: 31, title: 'O God, Our Help in Ages Past' },
    closingPrayer: 'Brother Davis',
    announcements: ['Ward temple night: May 10', 'Youth conference next Saturday']
  },
  {
    id: 2,
    date: '2026-05-10',
    meetingType: 'testimony',
    presiding: 'Bishop Smith',
    conducting: 'Bishop Smith',
    openingHymn: { number: 136, title: 'I Know That My Redeemer Lives' },
    openingPrayer: 'Brother Johnson',
    wardBusiness: [{ description: 'Release of Elder Quorum presidency with vote of thanks' }],
    stakeBusiness: false,
    sacramentHymn: { number: 185, title: 'Reverently and Meekly Now' },
    speakers: [],
    closingHymn: { number: 301, title: 'I Am a Child of God' },
    closingPrayer: 'Sister Taylor',
    announcements: ['Fast and testimony meeting today']
  },
  {
    id: 3,
    date: '2026-05-17',
    meetingType: 'regular',
    presiding: 'President Vance',
    conducting: 'Brother Clark',
    openingHymn: { number: 67, title: 'Glory to God on High' },
    openingPrayer: 'Brother Martinez',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [
      { name: 'Brother Anderson', topic: 'Ministering with Love', type: 'speaker' },
      { name: 'Sister Garcia', topic: 'Daily Scripture Study', type: 'speaker' }
    ],
    closingHymn: { number: 252, title: 'Put Your Shoulder to the Wheel' },
    closingPrayer: 'Sister White',
    announcements: ['Stake conference upcoming in two weeks']
  },
  {
    id: 4,
    date: '2026-05-24',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    openingHymn: { number: 86, title: 'How Great Thou Art' },
    openingPrayer: 'Brother Lee',
    wardBusiness: [{ description: 'Ward activity committee report' }],
    stakeBusiness: false,
    sacramentHymn: { number: 175, title: 'O God, the Eternal Father' },
    speakers: [
      { name: 'Brother Thomas', topic: 'Temple Covenants', type: 'speaker' }
    ],
    closingHymn: { number: 152, title: 'God Be With You Till We Meet Again' },
    closingPrayer: 'Sister Harris',
    announcements: ['No midweek youth activity this Wednesday']
  },
  {
    id: 5,
    date: '2026-05-31',
    meetingType: 'stake',
    presiding: 'Stake President Miller',
    conducting: 'President Miller',
    openingHymn: { number: 33, title: 'Our Mountain Home' },
    openingPrayer: 'President Clark',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 181, title: 'Jesus of Nazareth, Savior and King' },
    speakers: [
      { name: 'President Miller', topic: 'Stake Vision and Goals', type: 'speaker' },
      { name: 'High Council Speaker', topic: 'Self-Reliance Principles', type: 'speaker' }
    ],
    closingHymn: { number: 27, title: 'Praise to the Man' },
    closingPrayer: 'Sister Robinson',
    announcements: ['Stake leadership training on Tuesday evening']
  }
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  if (date) {
    return meetings.filter((m) => m.date === date);
  }
  return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find((m) => m.id === id) ?? null;
}