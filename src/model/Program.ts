import {BalanceRule} from "./BalanceRule";
import {RedemptionRule} from "./RedemptionRule";

export interface Program {
    id: string;
    name: string;
    currency: string;
    discount: boolean;
    discountSellerLiability: number;
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
}
