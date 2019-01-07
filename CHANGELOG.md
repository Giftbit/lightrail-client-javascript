# Changelog

## 4.0.0
- Added listValuesTransactions to values
- Added listValuesAttachedContacts to values
- Breaking change refactoring how setting contentType:text/csv was accessed

## 3.2.3
[Fixed Dist Dir](https://github.com/Giftbit/lightrail-client-javascript/pull/32)
 - Fixed missing dist folder

## 3.2.1
[Program Creation name](https://github.com/Giftbit/lightrail-client-javascript/pull/31)
 - Made Program name required
 - Fixed Value Creation Response typo
 
## 3.2.0
[Added new transaction types](https://github.com/Giftbit/lightrail-client-javascript/pull/30)
 - Added reverse to transactions
 - Added capturePending to transactions
 - Added voidPending to transactions 
 - Added createdBy to Contact, Program and Value

## 3.1.2
[Updated LightrailTransactionStep](https://github.com/Giftbit/lightrail-client-javascript/pull/29)
 - Added usesRemaining properties to LightrailTransactionStep

## 3.1.1
[Fixed Debit/Credit params](https://github.com/Giftbit/lightrail-client-javascript/pull/28)
 - Debit/Credit Uses Bugfix (removed req check for amount), added tests

## 3.1.0
[Fixed Debit/Credit params](https://github.com/Giftbit/lightrail-client-javascript/pull/27)
 - Fixed Uses param, updated amount to optional

## 3.0.4
[Modified 404 responses](https://github.com/Giftbit/lightrail-client-javascript/pull/26)
 - 404 Responses now come back in the LightrailResponse format with body set to null
 - Added status to LightrailResponse

## 3.0.3
[Added Issuance active property](https://github.com/Giftbit/lightrail-client-javascript/pull/25)

## 3.0.2
[Fixed Delete Currency Params](https://github.com/Giftbit/lightrail-client-javascript/pull/24)
 - Fixed Typo in DeleteCurrencyParams file name
 - Fixed Response definition, DeleteCurrencyRequest to DeleteCurrencyResponse
 - Fixed validateRequiredParams method to to avoid issues with valid falsy values (ie: 0)

## 3.0.0
[Deprecation updates and minor naming bug fixes.](https://github.com/Giftbit/lightrail-client-javascript/pull/22) 
- Renamed:
    - `valueRule` -> `balanceRule`
    - `uses` -> `usesRemaining`
    - `fixedInitialUses` -> `fixedInitialUsesRemaining`
    - `preTax` -> `pretax`
- Added new Transaction.totals properties: (`paidLightrail`, `paidStripe`, `paidInternal`, `discountLightrail`). 
