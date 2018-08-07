import {ValueRule} from "./ValueRule";
import {RedemptionRule} from "./RedemptionRule";

export interface Program {
    id: string;
    name: string;
    currency: string;
    discount: boolean;
    discountSellerLiability: number;
    preTax: boolean;
    active: boolean;
    redemptionRule: RedemptionRule;
    valueRule: ValueRule;
    minInitialBalance: number;
    maxInitialBalance: number;
    fixedInitialBalances: number[];
    fixedInitialUses: number[];
    startDate: string;
    endDate: string;
    metadata: object;
    createdDate: string;
    updatedDate: string;
}
