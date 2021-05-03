import 'isomorphic-fetch';
import { quotePayloadT } from '../types';

const getQuote = (
  token: string,
  tenantId: string,
  payload: quotePayloadT,
  date: string,
): Promise<any> => {
  const body = JSON.stringify({ ...payload, ready_for_pickup_at: date });

  return fetch(`${process.env.RENDR_API_URL}/${tenantId}/deliveries/quote`, {
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

export default getQuote;
