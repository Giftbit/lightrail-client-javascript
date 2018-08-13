import * as lightrail from "./";
import {LightrailRequestError} from "./LightrailRequestError";
import {DeleteProgramParams, GetProgramParams, ListProgramsParams, ListProgramsResponse} from "./params";
import {CreateProgramParams, CreateProgramResponse} from "./params/programs/CreateProgramParams";
import {formatResponse, validateRequiredParams} from "./requestUtils";
import {DeleteProgramResponse} from "./params/programs/DeleteProgramParams";
import {UpdateProgramParams, UpdateProgramResponse} from "./params/programs/UpdateProgramParams";
import {GetProgramResponse} from "./params/programs/GetProgramParams";
import {CreateIssuanceParams, CreateIssuanceResponse} from "./params/programs/issuance/CreateIssuanceParams";
import {Program} from "./model";
import {ListIssuancesParams, ListIssuancesResponse} from "./params/programs/issuance/ListIssuancesParams";
import {GetIssuanceParams, GetIssuanceResponse} from "./params/programs/issuance/GetIssuanceParams";
import {Issuance} from "./model/Issuance";

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
export async function listPrograms(params?: ListProgramsParams): Promise<ListProgramsResponse> {
    const resp = await lightrail.request("GET", "programs").query(params);
    if (resp.status === 200) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

export async function getProgram(params: GetProgramParams): Promise<GetProgramResponse> {
    const resp = await lightrail.request("GET", `programs/${encodeURIComponent(params.programId)}`);
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
    } else if (!params.programId) {
        throw new Error("programId in updateProgram({programId, params:{}}) is no set!");
    }

    const resp = await lightrail.request("PATCH", `programs/${encodeURIComponent(params.programId)}`).send(params.values);
    if (resp.status === 200) {
        return formatResponse(resp);
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}

// DELETE
export async function deleteProgram(params: DeleteProgramParams): Promise<DeleteProgramResponse> {
    if (!params || !params.programId) {
        throw new Error("programId missing in deleteProgram({programId}) is not set!");
    }

    const resp = await lightrail.request("DELETE", `programs/${encodeURIComponent(params.programId)}`);

    if (resp.status === 200) {
        return formatResponse(resp);
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}

///////////////////
// [ ISSUANCE ]

// CREATE
export async function createIssuance(params: CreateIssuanceParams): Promise<CreateIssuanceResponse> {
    if (!params) {
        throw new Error("createIssuance({programId, params:{}}) param object not set");
    } else if (!params.programId) {
        throw new Error("programId in createIssuance({programId, params:{}}) is no set!");
    } else if (!params.values) {
        throw new Error("params in createIssuance({programId, params:{}}) is no set!");
    } else {
        validateRequiredParams(["id"], params.values);
    }

    const resp = await lightrail.request("POST", `programs/${encodeURIComponent(params.programId)}/issuances`).send(params.values);
    if (resp.status === 200 || resp.status === 201) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

// READ
export async function listIssuances(params: ListIssuancesParams): Promise<ListIssuancesResponse> {
    if (!params.programId) {
        throw new Error("programId in listIssuances({programId}) is no set!");
    }

    const resp = await lightrail.request("GET", `programs/${encodeURIComponent(params.programId)}/issuances`).query(params.options);
    if (resp.status === 200) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

export async function getIssuance(params: GetIssuanceParams): Promise<GetIssuanceResponse> {

    if (!params.programId) {
        throw new Error("programId in getIssuance({programId, issuanceId}) is no set!");
    }
    if (!params.issuanceId) {
        throw new Error("issuanceId in getIssuance({programId, issuanceId}) is no set!");
    }

    const resp = await lightrail.request("GET", `programs/${encodeURIComponent(params.programId)}/issuances/${encodeURIComponent(params.issuanceId)}`);
    if (resp.status === 200) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}


///////////////////
/**
 * Get programId from the string (as the ID itself) or Program object.
 */
export function getProgramId(program: string | Program): string {
    if (!program) {
        throw new Error("program not set");
    } else if (typeof program === "string") {
        return program;
    } else if (program.id) {
        return program.id;
    } else {
        throw new Error("program must be a string for programId or a Program object");
    }
}

/**
 * Get issuanceId from the string (as the ID itself) or Issuance object.
 */
export function getIssuanceId(issuance: string | Issuance): string {
    if (!issuance) {
        throw new Error("issuance not set");
    } else if (typeof issuance === "string") {
        return issuance;
    } else if (issuance.id) {
        return issuance.id;
    } else {
        throw new Error("issuance must be a string for issuanceId or a Issuance object");
    }
}