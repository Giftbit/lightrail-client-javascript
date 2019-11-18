import {BalanceRule} from "./BalanceRule";
import {RedemptionRule} from "./RedemptionRule";
/** @deprecated discountSellerLiability since v4.3.0 - use DiscountSellerLiabilityRule instead. */
import {DiscountSellerLiabilityRule} from "./DiscountSellerLiabilityRule";

export interface Program {
    id: string;
    name: string;
    currency: string;
    discount: boolean;
    discountSellerLiability: number;
    discountSellerLiabilityRule: DiscountSellerLiabilityRule;
    pretax: boolean;
    active: boolean;
    redemptionRule: RedemptionRule;
    balanceRule: BalanceRule;
    minInitialBalance: number;
    maxInitialBalance: number;
    fixedInitialBalances: number[];
    fixedInitialUsesRemaining: number[];
    startDate: string;
    endDate: string;
    metadata: object;
    createdDate: string;
    updatedDate: string;
    createdBy: string;
}
