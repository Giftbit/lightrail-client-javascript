import {LightrailResponse} from "../LightrailResponse";
import {Program} from "../../model";

export interface GetProgramParams {
    programId: string;
}

export interface GetProgramResponse extends LightrailResponse<Program> {
}