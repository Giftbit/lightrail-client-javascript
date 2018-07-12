import {CreateValueParams, CreateValueRespone} from "./params/values/CreateValueParams";
import {formatResponse} from "./requestUtils";
import {LightrailRequestError} from "./LightrailRequestError";
import * as lightrail from "./index";


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