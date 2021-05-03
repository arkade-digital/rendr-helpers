import { Dayjs } from 'dayjs';
import { openingHourT } from '../types';

const SERVICE_LIST = {
  fast: 'Rendr Fast',
  standard: 'Rendr Standard',
  flexible: 'Rendr Flexible',
};

const DEFAULT_OPENING_HOURS = [
  { from: '09:00', to: '17:00', buffer_minutes: '30' },
  { from: '09:00', to: '17:00', buffer_minutes: '30' },
  { from: '09:00', to: '17:00', buffer_minutes: '30' },
  { from: '09:00', to: '17:00', buffer_minutes: '30' },
  { from: '09:00', to: '17:00', buffer_minutes: '30' },
  { from: '09:00', to: '17:00', buffer_minutes: '30' },
  { from: '09:00', to: '17:00', buffer_minutes: '30' },
];

const TIMEZONE_MAPPING = {
  VIC: 'Australia/Melbourne',
  NSW: 'Australia/Sydney',
  TAS: 'Australia/Hobart',
  QLD: 'Australia/Brisbane',
  NT: 'Australia/Darwin',
  WA: 'Australia/Perth',
  ACT: 'Australia/Canberra',
};

const isStoreClosed = (from: string, to: string): boolean => {
  return from === to;
};

const getNextDate = (
  storeDate: Dayjs,
  currentDay: number,
  opening_hours: Array<openingHourT>,
  maxProductBuffer: number,
): Dayjs | null => {
  let from, to, buffer_minutes;
  for (let i = 0; i < 7; i++) {
    currentDay = (currentDay + 1) % 7;
    storeDate = storeDate.add(1, 'd');
    ({ from, to, buffer_minutes } = opening_hours[currentDay]);
    if (!isStoreClosed(from, to)) {
      break;
    }
  }

  if (!from || !to) return null;
  if (isStoreClosed(from, to)) return null;

  const buffer = Math.max(maxProductBuffer, Number(buffer_minutes));
  const fromArray = from.split(':');
  const fromDate = storeDate
    .hour(Number(fromArray[0]))
    .minute(Number(fromArray[1]));
  return fromDate.add(buffer, 'm');
};

export {
  SERVICE_LIST,
  DEFAULT_OPENING_HOURS,
  TIMEZONE_MAPPING,
  isStoreClosed,
  getNextDate,
};
