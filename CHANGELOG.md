# Changelog

## 3.0.2
[Fixed Delete Currency Params](https://github.com/Giftbit/lightrail-client-javascript/pull/24)
 - Fixed Typo in DeleteCurrencyParams file name
 - Fixed Response definition, DeleteCurrencyRequest to DeleteCurrencyResponse


## 3.0.0
[Deprecation updates and minor naming bug fixes.](https://github.com/Giftbit/lightrail-client-javascript/pull/22) 
- Renamed:
    - `valueRule` -> `balanceRule`
    - `uses` -> `usesRemaining`
    - `fixedInitialUses` -> `fixedInitialUsesRemaining`
    - `preTax` -> `pretax`
- Added new Transaction.totals properties: (`paidLightrail`, `paidStripe`, `paidInternal`, `discountLightrail`). 