import * as lightrail from "./";
import {LightrailRequestError} from "./LightrailRequestError";
import {ListProgramsParams, ListProgramsResponse} from "./params";
import {CreateProgramParams, CreateProgramResponse} from "./params/programs/CreateProgramParams";
import {formatResponse, validateRequiredParams} from "./requestUtils";
import {DeleteProgramResponse} from "./params/programs/DeleteProgramParams";
import {UpdateProgramParams, UpdateProgramResponse} from "./params/programs/UpdateProgramParams";
import {GetProgramResponse} from "./params/programs/GetProgramParams";
import {CreateIssuanceParams, CreateIssuanceResponse} from "./params/programs/issuance/CreateIssuanceParams";
import {Program} from "./model";
import {ListIssuancesParams, ListIssuancesResponse} from "./params/programs/issuance/ListIssuancesParams";
import {GetIssuanceResponse} from "./params/programs/issuance/GetIssuanceParams";
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

export async function getProgram(program: string | Program): Promise<GetProgramResponse> {
    const programId = getProgramId(program);

    const resp = await lightrail.request("GET", `programs/${encodeURIComponent(programId)}`);
    if (resp.status === 200) {
        return formatResponse(resp);
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}

// UPDATE
export async function updateProgram(program: string | Program, params: UpdateProgramParams): Promise<UpdateProgramResponse> {
    const programId = getProgramId(program);

    if (!params) {
        throw new Error("params not set");
    }

    const resp = await lightrail.request("PATCH", `programs/${encodeURIComponent(programId)}`).send(params);
    if (resp.status === 200) {
        return formatResponse(resp);
    } else if (resp.status === 404) {
        return null;
    }
    throw new LightrailRequestError(resp);
}

// DELETE
export async function deleteProgram(program: string | Program): Promise<DeleteProgramResponse> {
    const programId = getProgramId(program);

    const resp = await lightrail.request("DELETE", `programs/${encodeURIComponent(programId)}`);

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
export async function createIssuance(program: string | Program, params: CreateIssuanceParams): Promise<CreateIssuanceResponse> {
    const programId = getProgramId(program);

    if (!params) {
        throw new Error("createIssuance(p) params not set");
    } else {
        validateRequiredParams(["id"], params);
    }

    const resp = await lightrail.request("POST", `programs/${encodeURIComponent(programId)}/issuances`).send(params);
    if (resp.status === 200 || resp.status === 201) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

// READ
export async function listIssuances(program: string | Program, params?: ListIssuancesParams): Promise<ListIssuancesResponse> {
    const programId = getProgramId(program);

    const resp = await lightrail.request("GET", `programs/${encodeURIComponent(programId)}/issuances`);
    if (resp.status === 200) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

export async function getIssuance(program: string | Program, issuance: string | Issuance): Promise<GetIssuanceResponse> {
    const programId = getProgramId(program);
    const issuanceId = getIssuanceId(issuance);

    if (!issuanceId) {
        throw new Error("issuanceId in getIssuance(program, issuanceId) is no set!");
    }

    const resp = await lightrail.request("GET", `programs/${encodeURIComponent(programId)}/issuances/${encodeURIComponent(issuanceId)}`);
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