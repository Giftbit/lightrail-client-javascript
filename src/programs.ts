import * as lightrail from "./";
import {LightrailRequestError} from "./LightrailRequestError";
import {PaginatedResponse, Program} from "./model";
import {GetProgramsParams, PaginationParams} from "./params";
import {CreateProgramParams, CreateProgramResponse} from "./params/programs/CreateProgramParams";

export async function createProgram(params: CreateProgramParams): Promise<CreateProgramResponse> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.id) {
        throw new Error("params.id not set");
    }

    const resp = await lightrail.request("POST", "programs").send(params);
    if (resp.status === 200) {
        return resp.body.program;
    }

    throw new LightrailRequestError(resp);
}

export async function getPrograms(params: GetProgramsParams | PaginationParams): Promise<{ programs: Program[], pagination: PaginatedResponse }> {
    const resp = await lightrail.request("GET", "programs").query(params);
    if (resp.status === 200) {
        return resp.body;
    }
    throw new LightrailRequestError(resp);
}

export async function getProgramById(programId: string): Promise<Program> {
    const resp = await lightrail.request("GET", `programs/${encodeURIComponent(programId)}`);
    if (resp.status === 200) {
        return resp.body.program;
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}