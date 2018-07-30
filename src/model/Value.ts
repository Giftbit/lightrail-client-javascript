import {ValueRule} from "./ValueRule";

export interface Value {
    id: string;
    currency: string;
    balance: number;
    uses: number;
    programId: string;
    code: string;
    isGenericCode: boolean;
    contactId: string;
    preTax: boolean;
    active: boolean;
    frozen: boolean;
    canceled: boolean;
    redemptionRule: Object;
    valueRule: ValueRule;
    discount: boolean;
    discountSellerLiability: number;
    startDate: string;
    endDate: string;
    tags: string[];
    metadata: Object;
    createdDate: string;
    updatedDate: string;
}