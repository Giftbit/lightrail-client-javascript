import {formatResponse, validateRequiredParams} from "./requestUtils";
import {LightrailRequestError} from "./LightrailRequestError";
import * as lightrail from "./index";
import {CreateCurrencyParams, CreateCurrencyResponse} from "./params/currencies/CreateCurrencyParams";
import {Currency} from "./model/Currency";
import {ListCurreniesResponse} from "./params";
import {GetCurrencyResponse} from "./params/currencies/GetCurrencyParams";
import {UpdateCurrencyParams, UpdateCurrencyResponse} from "./params/currencies/UpdateCurrencyParams";
import {DeleteCurrencyResponse} from "./params/currencies/DeleteCurrencyParams";

// CREATE
export async function createCurrency(params: CreateCurrencyParams): Promise<CreateCurrencyResponse> {
    if (!params) {
        throw new Error("missing currency");
    } else {
        validateRequiredParams(["code", "name", "symbol", "decimalPlaces"], params);
    }

    const resp = await lightrail.request("POST", "currencies").send(params);
    if (resp.status === 200 || resp.status === 201) {
        return (
            formatResponse(resp)
        );
    }
    throw new LightrailRequestError(resp);
}

// READ
export async function listCurrencies(): Promise<ListCurreniesResponse> {
    const resp = await lightrail.request("GET", `currencies`);
    if (resp.status === 200) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

export async function getCurrency(currency: string | Currency): Promise<GetCurrencyResponse> {
    const currencyCode = getCurrencyCode(currency);

    if (!currencyCode) {
        throw new Error("currencyCode missing from getCurrency(currency)!");
    }

    const resp = await lightrail.request("GET", `currencies/${encodeURIComponent(currencyCode)}`);
    if (resp.status === 200) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

// UPDATE
export async function updateCurrency(currency: string | Currency, params: UpdateCurrencyParams): Promise<UpdateCurrencyResponse> {
    const currencyCode = getCurrencyCode(currency);

    if (!currencyCode) {
        throw new Error("currencyCode missing from updateCurrency(currency, params)!");
    }
    if (!params) {
        throw new Error("params sent to updateCurrency(currency, params)");
    }

    const resp = await lightrail.request("PATCH", `currencies/${encodeURIComponent(currencyCode)}`).send(params);
    if (resp.status === 200) {
        return formatResponse(resp);
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}

// DELETE
export async function deleteCurrency(currency: string | Currency): Promise<DeleteCurrencyResponse> {
    const currencyCode = getCurrencyCode(currency);

    const resp = await lightrail.request("DELETE", `currencies/${encodeURIComponent(currencyCode)}`);

    if (resp.status === 200) {
        return formatResponse(resp);
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}


/**
 * Get currency code from the string (as the ID itself) or Currency object.
 */
export function getCurrencyCode(currency: string | Currency): string {
    if (!currency) {
        throw new Error("currency issuance not set");
    } else if (typeof currency === "string") {
        return currency;
    } else if (currency.code) {
        return currency.code;
    } else {
        throw new Error("issuance must be a string for issuanceId or a Issuance object");
    }
}