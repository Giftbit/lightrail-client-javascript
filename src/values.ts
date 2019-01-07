import {
    ChangeValuesCodeParams,
    ChangeValuesCodeResponse,
    CreateValueParams,
    CreateValueResponse,
    DeleteValueResponse,
    GetValueParams,
    GetValueResponse,
    ListContactsParams,
    ListContactsResponse,
    ListTransactionsParams,
    ListTransactionsResponse,
    ListValuesParams,
    ListValuesResponse,
    UpdateValueParams,
    UpdateValueResponse
} from "./params";
import {formatFilterParams, formatResponse, isSuccessStatus, validateRequiredParams} from "./requestUtils";
import {LightrailRequestError} from "./LightrailRequestError";
import * as lightrail from "./index";
import {Value} from "./model";
import {ContentType} from "./params/ContentType";

export async function createValue(params: CreateValueParams): Promise<CreateValueResponse> {
    if (!params) {
        throw new Error("params not set");
    } else {
        validateRequiredParams(["id", "currency"], params);
    }

    const resp = await lightrail.request("POST", "values").send(params);
    if (isSuccessStatus(resp.status)) {
        return (
            formatResponse(resp)
        );
    }

    throw new LightrailRequestError(resp);
}

export async function listValues(params?: ListValuesParams, contentType: ContentType = "application/json"): Promise<ListValuesResponse> {
    const resp = await lightrail.request("GET", "values").set("accept", contentType).query(formatFilterParams(params));
    if (isSuccessStatus(resp.status)) {
        return (
            formatResponse(resp)
        );
    }

    throw new LightrailRequestError(resp);
}

export async function getValue(value: string | Value, params?: GetValueParams): Promise<GetValueResponse> {
    const valueId = getValueId(value);

    const resp = await lightrail.request("GET", `values/${encodeURIComponent(valueId)}`).query(params);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return (
            formatResponse(resp)
        );
    }

    throw new LightrailRequestError(resp);
}

export async function updateValue(value: string | Value, params: UpdateValueParams): Promise<UpdateValueResponse> {
    const valueId = getValueId(value);

    const resp = await lightrail.request("PATCH", `values/${encodeURIComponent(valueId)}`).send(params);
    if (isSuccessStatus(resp.status)) {
        return (
            formatResponse(resp)
        );
    }

    throw new LightrailRequestError(resp);
}

export async function changeValuesCode(value: string | Value, params: ChangeValuesCodeParams): Promise<ChangeValuesCodeResponse> {
    const valueId = getValueId(value);

    const resp = await lightrail.request("POST", `values/${encodeURIComponent(valueId)}/changeCode`).send(params);
    if (isSuccessStatus(resp.status)) {
        return (
            formatResponse(resp)
        );
    }

    throw new LightrailRequestError(resp);
}

export async function deleteValue(value: string | Value): Promise<DeleteValueResponse> {
    const valueId = getValueId(value);

    const resp = await lightrail.request("DELETE", `values/${encodeURIComponent(valueId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return (
            formatResponse(resp)
        );
    }

    throw new LightrailRequestError(resp);
}

export async function listValuesTransactions(value: string | Value, params?: ListTransactionsParams): Promise<ListTransactionsResponse> {
    const valueId = getValueId(value);

    const resp = await lightrail.request("GET", `values/${encodeURIComponent(valueId)}/transactions`).query(formatFilterParams(params));
    if (isSuccessStatus(resp.status)) {
        return (
            formatResponse(resp)
        );
    }

    throw new LightrailRequestError(resp);
}

export async function listValuesAttachedContacts(value: string | Value, params?: ListContactsParams): Promise<ListContactsResponse> {
    const valueId = getValueId(value);

    const resp = await lightrail.request("GET", `values/${encodeURIComponent(valueId)}/contacts`).query(formatFilterParams(params));
    if (isSuccessStatus(resp.status)) {
        return (
            formatResponse(resp)
        );
    }

    throw new LightrailRequestError(resp);
}

/**
 * Get contactId from the string (as the ID itself) or Contact object.
 */
export function getValueId(value: string | Value): string {
    if (!value) {
        throw new Error("value not set");
    } else if (typeof value === "string") {
        return value;
    } else if (value.id) {
        return value.id;
    } else {
        throw new Error("value must be a string for valueId or a Value object");
    }
}
