import * as lightrail from "./";
import {LightrailRequestError} from "./LightrailRequestError";
import {
    CreateIssuanceParams,
    CreateIssuanceResponse,
    CreateProgramParams,
    CreateProgramResponse,
    DeleteProgramResponse,
    GetIssuanceResponse,
    GetProgramResponse,
    ListIssuancesParams,
    ListIssuancesResponse,
    ListProgramsParams,
    ListProgramsResponse,
    UpdateProgramParams,
    UpdateProgramResponse
} from "./params";
import {formatFilterParams, formatResponse, isSuccessStatus, validateRequiredParams} from "./requestUtils";
import {Issuance, Program} from "./model";

/**
 * See: https://apidocs.lightrail.com/#operation/CreateProgram
 *
 * Example:
 * ```js
 * const program = await Lightrail.programs.createProgram({
 *     id: "abcdefg",
 *     currency: "USD",
 *     name: "Gift Cards",
 *     minInitialBalance: 250,
 *     maxInitialBalance: 50000
 * });
 * ```
 */
export async function createProgram(params: CreateProgramParams): Promise<CreateProgramResponse> {
    if (!params) {
        throw new Error("params not set");
    } else {
        validateRequiredParams(["id"], params);
    }

    const resp = await lightrail.request("POST", "programs").send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/ListPrograms
 *
 * Example:
 * ```js
 * const programs = await Lightrail.programs.listPrograms();
 * const programsLimited = await Lightrail.programs.listPrograms({limit: 5});
 * ```
 */
export async function listPrograms(params?: ListProgramsParams): Promise<ListProgramsResponse> {
    const resp = await lightrail.request("GET", "programs").query(formatFilterParams(params));
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/GetaProgram
 *
 * Example:
 * ```js
 * const program = await Lightrail.programs.getProgram("abcdefg");
 * ```
 */
export async function getProgram(program: string | Program): Promise<GetProgramResponse> {
    const programId = getProgramId(program);

    const resp = await lightrail.request("GET", `programs/${encodeURIComponent(programId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/UpdateProgram
 *
 * Example:
 * ```js
 * const program = await Lightrail.programs.updateProgram("abcdefg", {name: "Awesome Gift Cards"});
 * ```
 */
export async function updateProgram(program: string | Program, params: UpdateProgramParams): Promise<UpdateProgramResponse> {
    const programId = getProgramId(program);

    if (!params) {
        throw new Error("params not set");
    }

    const resp = await lightrail.request("PATCH", `programs/${encodeURIComponent(programId)}`).send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/DeleteProgram
 *
 * Example:
 * ```js
 * await Lightrail.programs.deleteProgram("abcdefg");
 * ```
 */
export async function deleteProgram(program: string | Program): Promise<DeleteProgramResponse> {
    const programId = getProgramId(program);

    const resp = await lightrail.request("DELETE", `programs/${encodeURIComponent(programId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/CreateIssuance
 *
 * Example:
 * ```js
 * const issuance = await Lightrail.programs.createIssuance("abcdefg", {
 *     id: "hijklmnop",
 *     name: "Some cards",
 *     count: 500,
 *     generateCode: {},
 *     balance: 5000
 * });
 * ```
 */
export async function createIssuance(program: string | Program, params: CreateIssuanceParams): Promise<CreateIssuanceResponse> {
    const programId = getProgramId(program);

    if (!params) {
        throw new Error("createIssuance(p) params not set");
    } else {
        validateRequiredParams(["id"], params);
    }

    const resp = await lightrail.request("POST", `programs/${encodeURIComponent(programId)}/issuances`).send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/ListIssuances
 *
 * Example:
 * ```js
 * const issuances = await Lightrail.programs.listIssuances("abcdefg");
 * const issuancesLimited = await Lightrail.programs.listIssuances("abcdefg", {limit: 5});
 * ```
 */
export async function listIssuances(program: string | Program, params?: ListIssuancesParams): Promise<ListIssuancesResponse> {
    const programId = getProgramId(program);

    const resp = await lightrail.request("GET", `programs/${encodeURIComponent(programId)}/issuances`).query(formatFilterParams(params));
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/GetanIssuance
 *
 * Example:
 * ```js
 * const issuance = await Lightrail.programs.getIssuance("abcdefg", "hijklmnop");
 * ```
 */
export async function getIssuance(program: string | Program, issuance: string | Issuance): Promise<GetIssuanceResponse> {
    const programId = getProgramId(program);
    const issuanceId = getIssuanceId(issuance);

    if (!issuanceId) {
        throw new Error("issuanceId in getIssuance(program, issuanceId) is no set!");
    }

    const resp = await lightrail.request("GET", `programs/${encodeURIComponent(programId)}/issuances/${encodeURIComponent(issuanceId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * @internal
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
 * @internal
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
