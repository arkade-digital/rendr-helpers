# Rendr API Helper Functions

Small library to speed up development related to render bookings.

## Getting started

Install with yarn or npm

```sh
yarn add rendr-helpers
# OR
npm install rendr-helpers
```

then import getShippingRates function

```
import getShippingRates from './getShippingRates';

const rates = getShippingRates(rendrAccessToken, tenantId, payload, store, selectedDeliveryDate, state, addBuffer,  bufferOnDeliveryTime)
```

Packages is developed in TypeScript all argument definition can be seen in IDE.

### other available api calls

getStore : to fetch store details by store id
requestDeliver: to create deliver

## Utils

Supporting constants and functions are provided as well

### Functions

getNextDate  
isStoreClosed

### Constant

TIMEZONE_MAPPING  
DEFAULT_OPENING_HOURS  
SERVICE_LIST

```
import getNextDate from './getShippingRates/utils';

```
