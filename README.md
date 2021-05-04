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

const rates = getShippingRates(rendrAccessToken, tenantId, payload, store, state, bufferOnDeliveryTime)
```

Packages id developed in TypeScript all argument definition can be seen in IDE.

## Utils
few supporting constants and functions are provided as well

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