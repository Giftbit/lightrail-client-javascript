import {Program} from "../../model/index";

export interface GetProgramsParams {
    id?: string;
    name?: string;
    currency?: string;
}

export interface GetProgramsResponse {
    programs: Program[];
}
