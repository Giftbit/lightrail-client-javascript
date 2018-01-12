import * as lightrail from "./";
import {LightrailRequestError} from "./LightrailRequestError";
import {GetProgramParams} from "./params/GetProgramParams";
import {PaginationParams} from "./params/PaginationParams";
import {Program} from "./model/Program";
import {Pagination} from "./model/Pagination";

export async function getPrograms(params: GetProgramParams | PaginationParams): Promise<{ programs: Program[], pagination: Pagination }> {
    const resp = await lightrail.request("GET", "programs").query(params);
    if (resp.status === 200) {
        return resp.body;
    }
    throw new LightrailRequestError(resp);
}
