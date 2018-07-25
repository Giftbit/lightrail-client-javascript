import {formatResponse, validateRequiredParams} from "./requestUtils";
import {LightrailRequestError} from "./LightrailRequestError";
import * as lightrail from "./index";
import {CreateCurrencyParams, CreateCurrencyResponse} from "./params/currencies/CreateCurrencyParams";

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