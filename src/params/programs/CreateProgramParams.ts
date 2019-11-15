import {Program} from "../../model";
import {LightrailResponse} from "../LightrailResponse";
import {BalanceRule} from "../../model/BalanceRule";
import {RedemptionRule} from "../../model/RedemptionRule";
import {DiscountSellerLiabilityRule} from "../../model/DiscountSellerLiabilityRule";

export interface CreateProgramParams {
    id: string;
    currency: string;
    name: string;
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

export interface CreateProgramResponse extends LightrailResponse<Program> {
}