import {Program} from "../../model";
import {LightrailResponse} from "../LightrailResponse";

export interface UpdateProgramParams {
    name?: string;
    active?: boolean;
    discount?: boolean;
    preTax?: boolean;
    minInitialBalance?: number;
    maxInitialBalance?: number;
    fixedInitialBalances?: number[];
    fixedInitialUses?: number[];
    startDate?: string;
    endDate?: string;
    metadata?: object;
}

export interface UpdateProgramResponse extends LightrailResponse<Program> {
}