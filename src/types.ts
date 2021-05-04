export interface errorT {
  error: string;
  errorType: 'store' | 'token';
}

export interface openingHourT {
  from: string;
  to: string;
  buffer_minutes: string;
}

export type stateT = 'VIC' | 'NSW' | 'TAS' | 'QLD' | 'NT' | 'WA' | 'ACT';

export interface storeT {
  timezone?: string;
  opening_hours: Array<openingHourT>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface lineItemT {
  code: string;
  name: string;
  price_cents: number;
  quantity: number;
  packing_instructions?: string;
}

interface AddressT {
  business?: boolean;
  address?: string;
  city: string;
  state: string;
  post_code: string;
}

interface parcelT {
  reference: string;
  description?: string;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  weight_kg: number;
  quantity: number;
}

export interface quotePayloadT {
  store_id: string;
  address: AddressT;
  line_items: Array<lineItemT>;
  parcels: Array<parcelT>;
}

export interface requestDeliveryPayloadT {
  store_id: string;
  reference: string;
  ready_for_pickup_at: string;
  delivery_type: string;
  address: AddressT;
  line_items: Array<lineItemT>;
  parcels: Array<parcelT>;
}

export default interface rateT {
  service_name: string;
  service_code: string;
  total_price: number;
  currency: string;
  description: string;
}
