import {Program} from "../../model";
import {LightrailResponse} from "../LightrailResponse";

export interface UpdateProgramParams {
    name?: string;
    active?: boolean;
    discount?: boolean;
    pretax?: boolean;
    minInitialBalance?: number;
    maxInitialBalance?: number;
    fixedInitialBalances?: number[];
    fixedInitialUsesRemaining?: number[];
    startDate?: string;
    endDate?: string;
    metadata?: object;
}

export interface UpdateProgramResponse extends LightrailResponse<Program> {
}