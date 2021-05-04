import {
  SERVICE_LIST,
  DEFAULT_OPENING_HOURS,
  TIMEZONE_MAPPING,
  isStoreClosed,
  getNextDate,
} from './utils';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import rateT, { quotePayloadT, stateT, storeT } from './types';
import getQuote from './api';

dayjs.extend(utc);
dayjs.extend(timezone);

const getShippingRates = async (
  rendrAccessToken: string,
  tenantId: string,
  payload: quotePayloadT,
  store: storeT,
  state: stateT = 'NSW',
  bufferOnDeliveryTime = 30,
): Promise<Error | Array<rateT>> => {
  const rates: Array<rateT> = [];
  const maxBufferOnDeliveryTime = Math.max(30, bufferOnDeliveryTime);
  // we need to return info no base of the timezone it request
  // so customer expected delilvery on their timezone.
  const localTimeZone = TIMEZONE_MAPPING[state];
  // we need to calculate deliver on base ot store's time zone
  // so store can pack order be ready
  const storeTimeZone = store?.timezone || localTimeZone;
  let openingHours = DEFAULT_OPENING_HOURS;
  if (store.opening_hours && store.opening_hours.length == 7) {
    openingHours = store.opening_hours;
  }

  let deliveryDate: Dayjs | null = dayjs().tz(storeTimeZone);
  let deliveryDateAfter12 = null;

  let storeDate = dayjs().tz(storeTimeZone);
  let day = storeDate.day();
  const currentDay = storeDate.day();
  let { from, to, buffer_minutes } = openingHours[day];

  // check if current day store is not closed
  // else get next open day
  for (let i = 0; i < 7; i++) {
    if (!isStoreClosed(from, to)) break;
    day = (day + 1) % 7;
    storeDate = storeDate.add(1, 'd');
    ({ from, to, buffer_minutes } = openingHours[day]);
  }

  if (isStoreClosed(from, to)) {
    throw new Error('No store open days found for next 7 days.');
  }

  const buffer = Math.max(maxBufferOnDeliveryTime, Number(buffer_minutes));

  const fromArray = from.split(':');
  const fromDate = storeDate
    .hour(Number(fromArray[0]))
    .minute(Number(fromArray[1]))
    .add(buffer, 'm');

  const toArray = to.split(':');
  const toDate = storeDate
    .hour(Number(toArray[0]))
    .minute(Number(toArray[1]))
    .subtract(buffer, 'm');

  if (deliveryDate.isBefore(fromDate)) {
    deliveryDate = fromDate;
  } else if (deliveryDate.isAfter(toDate)) {
    deliveryDate = getNextDate(
      storeDate,
      day,
      openingHours,
      maxBufferOnDeliveryTime,
    );
    if (!deliveryDate) {
      throw new Error('No next open day found for after closing time.');
    }
  } else {
    // delivery date is in between opening and closing time
    deliveryDate = deliveryDate.add(buffer, 'm');
    // check if hours is > 12 and find the next best date
    // assumiption made : store will be open before 12
    if (deliveryDate.tz(storeTimeZone).hour() >= 12) {
      deliveryDateAfter12 = getNextDate(
        storeDate,
        currentDay,
        openingHours,
        maxBufferOnDeliveryTime,
      );
      if (!deliveryDateAfter12) {
        console.log('No next open day found for after 12.');
      }
    }
  }

  let quote = null;
  let nextQuote = null;

  if (deliveryDateAfter12) {
    [quote, nextQuote] = await Promise.all([
      getQuote(
        rendrAccessToken,
        tenantId,
        payload,
        deliveryDate.utc().format('YYYY-MM-DDTHH:mm:ss.000[Z]'),
      ),
      getQuote(
        rendrAccessToken,
        tenantId,
        payload,
        deliveryDate.utc().format('YYYY-MM-DDTHH:mm:ss.000[Z]'),
      ),
    ]);
  } else {
    quote = await getQuote(
      rendrAccessToken,
      tenantId,
      payload,
      deliveryDate.utc().format('YYYY-MM-DDTHH:mm:ss.000[Z]'),
    );
  }

  const standard = nextQuote?.data?.standard || quote?.data?.standard;
  const flexible = nextQuote?.data?.flexible || quote?.data?.standard;
  const fast = quote.data?.fast;

  if (standard) {
    rates.push({
      service_name: SERVICE_LIST['standard'],
      service_code: `standard@${standard.from_datetime}@${standard.to_datetime}`,
      total_price: standard.price_cents,
      currency: 'AUD',
      description: `Get it by ${dayjs
        .utc(standard.to_datetime)
        .tz(localTimeZone)
        .format('ddd DD MMM')}`,
    });
  }

  if (flexible) {
    rates.push({
      service_name: SERVICE_LIST['flexible'],
      service_code: `flexible@${flexible.from_datetime}@${flexible.to_datetime}`,
      total_price: flexible.price_cents,
      currency: 'AUD',
      description: `Get it by ${dayjs
        .utc(flexible.to_datetime)
        .tz(localTimeZone)
        .format('ddd DD MMM')} 5pm`,
    });
  }

  if (fast) {
    rates.push({
      service_name: SERVICE_LIST['fast'],
      service_code: `fast@${fast.from_datetime}@${fast.to_datetime}`,
      total_price: fast.price_cents,
      currency: 'AUD',
      description: `Get it by ${dayjs
        .utc(fast.to_datetime)
        .tz(localTimeZone)
        .format('ddd DD MMM ha')}`,
    });
  }

  return rates;
};

export default getShippingRates;
