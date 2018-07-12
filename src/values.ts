import {CreateValueParams, CreateValueRespone} from "./params/values/CreateValueParams";
import {formatFilterParams, formatResponse} from "./requestUtils";
import {LightrailRequestError} from "./LightrailRequestError";
import * as lightrail from "./index";
import {GetValueResponse} from "./params/values/GetValueParams";
import {GetValuesParams, GetValuesResponse} from "./params/values/GetValuesParams";
import {Value} from "./model/Value";
import {UpdateValueParams, UpdateValueResponse} from "./params/values/UpdateValueParams";
import {LightrailResponse} from "./model/LightrailResponse";
import {Success} from "./model/Success";
import {ChangeValuesCodeParams, ChangeValuesCodeResponse} from "./params/values/ChangeValuesCodeParams";


export async function createValue(params: CreateValueParams): Promise<CreateValueRespone> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.id) {
        throw new Error("params.id not set");
    }

    const resp = await lightrail.request("POST", "values").send(params);
    if (resp.status === 200 || resp.status === 201) {
        return (
            formatResponse(resp)
        );
    }
    throw new LightrailRequestError(resp);
}

export async function getValue(value: string | Value, showCode?: string): Promise<GetValueResponse> {
    const valueId = getValueId(value);

    const resp = await lightrail.request("GET", `contacts/${encodeURIComponent(valueId)}`);
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    } else if (resp.status === 404) {
        return null;
    }

    throw new LightrailRequestError(resp);
}

export async function getValues(params: GetValuesParams): Promise<GetValuesResponse> {
    const resp = await lightrail.request("GET", "values").query(formatFilterParams(params));
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    }
    throw new LightrailRequestError(resp);
}

export async function updateValue(value: string | Value, params: UpdateValueParams): Promise<UpdateValueResponse> {
    const valueId = getValueId(value);

    const resp = await lightrail.request("PATCH", `values/${encodeURIComponent(valueId)}`).send(params);
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    } else if (resp.status === 404) {
        return null;
    }

    throw new LightrailRequestError(resp);
}

export async function deleteValue(value: string): Promise<LightrailResponse<Success>> {
    const valueId = getValueId(value);

    const resp = await lightrail.request("DELETE", `values/${encodeURIComponent(valueId)}`);
    if (resp.status === 200) {
        return (
            formatResponse(resp)
        );
    } else if (resp.status === 404) {
        return null;
    }

    throw new LightrailRequestError(resp);
}

export async function changeValuesCode(value: string | Value, params: ChangeValuesCodeParams): Promise<ChangeValuesCodeResponse> {
    const valueId = getValueId(value);

    const resp = await lightrail.request("POST", `values/${encodeURIComponent(valueId)}`).send(params);
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