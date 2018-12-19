import {BalanceRule} from "./BalanceRule";
import {RedemptionRule} from "./RedemptionRule";

export interface Value {
    id: string;
    currency: string;
    balance: number;
    balanceRule: BalanceRule;
    usesRemaining: number;
    programId: string;
    code: string;
    isGenericCode: boolean;
    contactId: string;
    pretax: boolean;
    active: boolean;
    frozen: boolean;
    canceled: boolean;
    redemptionRule: RedemptionRule;
    discount: boolean;
    discountSellerLiability: number;
    startDate: string;
    endDate: string;
    tags: string[];
    metadata: object;
    createdDate: string;
    updatedDate: string;
    createdBy: string;
}
