import {LightrailResponse} from "../LightrailResponse";
import {Success} from "../../model/Success";

export interface DeleteProgramParams {
    programId: string;
}

export interface DeleteProgramResponse extends LightrailResponse<Success> {
}