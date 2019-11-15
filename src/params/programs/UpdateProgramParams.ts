import {BalanceRule, Program, RedemptionRule} from "../../model";
import {LightrailResponse} from "../LightrailResponse";
import {DiscountSellerLiabilityRule} from "../../model/DiscountSellerLiabilityRule";

export interface UpdateProgramParams {
    name?: string;
    discount?: boolean;
    discountSellerLiability?: number;
    discountSellerLiabilityRule?: DiscountSellerLiabilityRule;
    pretax?: boolean;
    active?: boolean;
    redemptionRule?: RedemptionRule;
    balanceRule?: BalanceRule;
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