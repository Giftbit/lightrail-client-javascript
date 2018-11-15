import {CreateValueParams, CreateValueRespone} from "./params/values/CreateValueParams";
import {formatFilterParams, formatResponse, isSuccessStatus, validateRequiredParams} from "./requestUtils";
import {LightrailRequestError} from "./LightrailRequestError";
import * as lightrail from "./index";
import {GetValueParams, GetValueResponse} from "./params/values/GetValueParams";
import {ListValuesParams, ListValuesResponse} from "./params/values/ListValuesParams";
import {Value} from "./model/Value";
import {UpdateValueParams, UpdateValueResponse} from "./params/values/UpdateValueParams";
import {ChangeValuesCodeParams, ChangeValuesCodeResponse} from "./params/values/ChangeValuesCodeParams";
import {DeleteValueResponse} from "./params/values/DeleteValueParams";

// CREATE
export async function createValue(params: CreateValueParams): Promise<CreateValueRespone> {
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

// READ
export async function listValues(params?: ListValuesParams): Promise<ListValuesResponse> {
    const resp = await lightrail.request("GET", "values").set("accept", (!!params && !!params.csv) ? "text/csv" : "application/json").query(formatFilterParams(params));
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
    if (isSuccessStatus(resp.status)) {
        return (
            formatResponse(resp)
        );
    }

    throw new LightrailRequestError(resp);
}

// UPDATE
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

// DELETE
export async function deleteValue(value: string | Value): Promise<DeleteValueResponse> {
    const valueId = getValueId(value);

    const resp = await lightrail.request("DELETE", `values/${encodeURIComponent(valueId)}`);
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