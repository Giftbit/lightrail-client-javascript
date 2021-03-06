import {Program} from "../../model";
import {LightrailResponse} from "../LightrailResponse";
import {BalanceRule} from "../../model";
import {RedemptionRule} from "../../model";
import {DiscountSellerLiabilityRule} from "../../model";

export interface CreateProgramParams {
    id: string;
    currency: string;
    name: string;
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

export interface CreateProgramResponse extends LightrailResponse<Program> {
}