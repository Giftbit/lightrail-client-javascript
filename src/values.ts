import {CreateValueParams, CreateValueRespone} from "./params/values/CreateValueParams";
import {formatFilterParams, formatResponse, validateRequiredParams} from "./requestUtils";
import {LightrailRequestError} from "./LightrailRequestError";
import * as lightrail from "./index";
import {GetValueParams, GetValueResponse} from "./params/values/GetValueParams";
import {ListValuesParams, ListValuesResponse} from "./params/values/ListValuesParams";
import {Value} from "./model/Value";
import {UpdateValueParams, UpdateValueResponse} from "./params/values/UpdateValueParams";
import {ChangeValuesCodeParams, ChangeValuesCodeResponse} from "./params/values/ChangeValuesCodeParams";
import {DeleteValueParams, DeleteValueResponse} from "./params/values/DeleteValueParams";

// CREATE
export async function createValue(params: CreateValueParams): Promise<CreateValueRespone> {
    if (!params) {
        throw new Error("params not set");
    } else {
        validateRequiredParams(["id", "currency"], params);
    }

    const resp = await lightrail.request("POST", "values").send(params);
    if (resp.status === 200 || resp.status === 201) {
        return (
            formatResponse(resp)
        );
    }
    throw new LightrailRequestError(resp);
}

// READ
export async function listValues(params?: ListValuesParams): Promise<ListValuesResponse> {
    const resp = await lightrail.request("GET", "values").set("accept", (!!params && !!params.getCSV) ? "text/csv" : "application/json").query(formatFilterParams(params));
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    }

    throw new LightrailRequestError(resp);
}

export async function getValue(params?: GetValueParams): Promise<GetValueResponse> {
    const resp = await lightrail.request("GET", `values/${encodeURIComponent(params.valueId)}`).query(params.options);
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    } else if (resp.status === 404) {
        return null;
    }

    throw new LightrailRequestError(resp);
}

// UPDATE
export async function updateValue(params: UpdateValueParams): Promise<UpdateValueResponse> {
    const resp = await lightrail.request("PATCH", `values/${encodeURIComponent(params.valueId)}`).send(params.values);
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    } else if (resp.status === 404) {
        return null;
    }

    throw new LightrailRequestError(resp);
}

export async function changeValuesCode(params: ChangeValuesCodeParams): Promise<ChangeValuesCodeResponse> {
    const resp = await lightrail.request("POST", `values/${encodeURIComponent(params.valueId)}/changeCode`).send(params.values);
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    } else if (resp.status === 404) {
        return null;
    }

    throw new LightrailRequestError(resp);
}

// DELETE
export async function deleteValue(params: DeleteValueParams): Promise<DeleteValueResponse> {
    const resp = await lightrail.request("DELETE", `values/${encodeURIComponent(params.valueId)}`);
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    } else if (resp.status === 404) {
        return null;
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