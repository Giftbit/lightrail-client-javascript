import {Program} from "../../model";
import {LightrailResponse} from "../LightrailResponse";

export interface UpdateProgramParams extends Partial<Program> {
}

export interface UpdateProgramResponse extends LightrailResponse<Program> {
}