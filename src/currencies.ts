import {formatResponse, isSuccessStatus, validateRequiredParams} from "./requestUtils";
import {LightrailRequestError} from "./LightrailRequestError";
import * as lightrail from "./index";
import {
    CreateCurrencyParams,
    CreateCurrencyResponse,
    DeleteCurrencyResponse,
    GetCurrencyResponse,
    ListCurrenciesResponse,
    UpdateCurrencyParams,
    UpdateCurrencyResponse
} from "./params";
import {Currency} from "./model/Currency";

/**
 * See: https://apidocs.lightrail.com/#operation/CreateCurrency
 *
 * Example:
 * ```js
 * const currency = await Lightrail.currencies.createCurrency({
 *     code: "USD",
 *     symbol: "$",
 *     name: "US Dollar",
 *     decimalPlaces: 2
 * });
 * ```
 */
export async function createCurrency(params: CreateCurrencyParams): Promise<CreateCurrencyResponse> {
    if (!params) {
        throw new Error("missing currency");
    } else {
        validateRequiredParams(["code", "name", "symbol", "decimalPlaces"], params);
    }

    const resp = await lightrail.request("POST", "currencies").send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/ListCurrencies
 *
 * Example:
 * ```js
 * const currencies = await Lightrail.currencies.listCurrencies();
 * ```
 */
export async function listCurrencies(): Promise<ListCurrenciesResponse> {
    const resp = await lightrail.request("GET", `currencies`);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/GetCurrency
 *
 * Example:
 * ```js
 * const usd = await Lightrail.currencies.getCurrency("USD");
 * ```
 */
export async function getCurrency(currency: string | Currency): Promise<GetCurrencyResponse> {
    const currencyCode = getCurrencyCode(currency);

    if (!currencyCode) {
        throw new Error("currencyCode missing from getCurrency(currency)!");
    }

    const resp = await lightrail.request("GET", `currencies/${encodeURIComponent(currencyCode)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/UpdateCurrency
 *
 * Example:
 * ```js
 * const updatedUsd = await Lightrail.currencies.updateCurrency("USD", {name: "Freedom Dollars"});
 * ```
 */
export async function updateCurrency(currency: string | Currency, params: UpdateCurrencyParams): Promise<UpdateCurrencyResponse> {
    const currencyCode = getCurrencyCode(currency);

    if (!currencyCode) {
        throw new Error("currencyCode missing from updateCurrency(currency, params)!");
    }
    if (!params) {
        throw new Error("params sent to updateCurrency(currency, params)");
    }

    const resp = await lightrail.request("PATCH", `currencies/${encodeURIComponent(currencyCode)}`).send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/DeleteCurrency
 *
 * This will only be possible if the currency has not been used because
 * Transactions cannot be deleted and Transactions must have a valid currency.
 *
 * Example:
 * ```js
 * await Lightrail.currencies.deleteCurrency("USD");
 * ```
 */
export async function deleteCurrency(currency: string | Currency): Promise<DeleteCurrencyResponse> {
    const currencyCode = getCurrencyCode(currency);

    const resp = await lightrail.request("DELETE", `currencies/${encodeURIComponent(currencyCode)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * Get currency code from the string (as the ID itself) or Currency object.
 */
export function getCurrencyCode(currency: string | Currency): string {
    if (currency == null) {
        throw new Error("currency not set");
    } else if (typeof currency === "string") {
        return currency;
    } else if (currency.code) {
        return currency.code;
    } else {
        throw new Error("currency must be a string or Currency object");
    }
}
