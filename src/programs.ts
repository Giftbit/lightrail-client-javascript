import * as lightrail from "./";
import {LightrailRequestError} from "./LightrailRequestError";
import {Program} from "./model";
import {GetProgramsParams, GetProgramsResponse} from "./params";
import {CreateProgramParams, CreateProgramResponse} from "./params/programs/CreateProgramParams";
import {formatResponse, validateRequiredParams} from "./requestUtils";
import {DeleteProgramResponse} from "./params/programs/DeleteProgramParams";
import {LightrailResponse} from "./model/LightrailResponse";
import {UpdateProgramParams, UpdateProgramResponse} from "./params/programs/UpdateProgramParams";

// CREATE
export async function createProgram(params: CreateProgramParams): Promise<CreateProgramResponse> {
    if (!params) {
        throw new Error("params not set");
    } else {
        validateRequiredParams(["id"], params);
    }

    const resp = await lightrail.request("POST", "programs").send(params);
    if (resp.status === 200 || resp.status === 201) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

// READ
export async function getPrograms(params?: GetProgramsParams): Promise<GetProgramsResponse> {
    const resp = await lightrail.request("GET", "programs").query(params);
    if (resp.status === 200) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

export async function getProgramById(programId: string): Promise<LightrailResponse<Program>> {
    const resp = await lightrail.request("GET", `programs/${encodeURIComponent(programId)}`);
    if (resp.status === 200) {
        return formatResponse(resp);
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}

// UPDATE
export async function updateProgram(params: UpdateProgramParams): Promise<UpdateProgramResponse> {
    if (!params) {
        throw new Error("params not set");
    } else {
        validateRequiredParams(["id"], params);
    }

    const resp = await lightrail.request("PATCH", `programs/${encodeURIComponent(params.id)}`).send(params);
    if (resp.status === 200) {
        return formatResponse(resp);
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}

// DELETE
export async function deleteProgram(programId: string): Promise<DeleteProgramResponse> {
    if (!programId) {
        throw new Error("Program Id missing in deleteProgram(id)");
    }

    const resp = await lightrail.request("DELETE", `programs/${encodeURIComponent(programId)}`);

    if (resp.status === 200) {
        return formatResponse(resp);
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}