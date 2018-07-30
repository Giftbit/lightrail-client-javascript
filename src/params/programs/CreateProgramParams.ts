import {Program} from "../../model";
import {LightrailResponse} from "../../model/LightrailResponse";
import {ValueRule} from "../../model/ValueRule";

export interface CreateProgramParams {
    id: string;
    currency: string;

    name?: string;
    discount?: boolean;
    discountSellerLiability?: number;
    preTax?: boolean;
    active?: boolean;
    redemptionRule?: Object;
    valueRule?: ValueRule;
    minInitialBalance?: number;
    maxInitialBalance?: number;
    fixedInitialBalances?: number[];
    fixedInitialUses?: number[];
    startDate?: string;
    endDate?: string;
    metadata?: Object;
}

export interface CreateProgramResponse extends LightrailResponse<Program> {
}