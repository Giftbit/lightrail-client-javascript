import {Program} from "../../model";
import {LightrailResponse} from "../../model/LightrailResponse";

export interface CreateProgramParams {
    id: string;
    currency: string;

    name?: string;
    discount?: boolean;
    discountSellerLiability?: number;
    preTax?: boolean;
    active?: boolean;
    redemptionRule?: Object;
    valueRule?: Object;
    minInitialBalance?: number;
    maxInitialBalance?: number;
    fixedInitialBalances?: number[];
    fixedInitialUses?: number[];
    startDate?: string;
    endDate?: string;
    metaData?: Object;
}

export interface CreateProgramResponse extends LightrailResponse<Program> {
}