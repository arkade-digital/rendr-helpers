import 'isomorphic-fetch';
import { quotePayloadT, requestDeliveryPayloadT } from '../types';

const getQuote = (
  apiUrl: string,
  token: string,
  tenantId: string,
  payload: quotePayloadT,
  date: string,
): Promise<any> => {
  const body = JSON.stringify({ ...payload, ready_for_pickup_at: date });

  return fetch(`${apiUrl}/${tenantId}/deliveries/quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
  }).then((res: any) => {
    // console.log('quote response:', res.json);
    return res.json();
  });
};

export const getStore = (
  apiUrl: string,
  token: string,
  storeId: number,
): Promise<any> => {
  return fetch(`${apiUrl}/${storeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};

export const requestDelivery = (
  apiUrl: string,
  token: string,
  tenantId: string,
  payload: requestDeliveryPayloadT,
): Promise<any> => {
  const body = JSON.stringify(payload);

  return fetch(`${apiUrl}/${tenantId}/deliveries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
};

export default getQuote;
