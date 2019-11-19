import {BalanceRule, Program, RedemptionRule} from "../../model";
import {LightrailResponse} from "../LightrailResponse";
import {DiscountSellerLiabilityRule} from "../../model";

export interface UpdateProgramParams {
    name?: string;
    discount?: boolean;
    /** @deprecated since v4.3.0 - use DiscountSellerLiabilityRule instead. */
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