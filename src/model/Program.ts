export interface Program {
    id: string;
    name: string;
    currency: string;
    discount: boolean;
    discountSellerLiability: number;
    preTax: boolean;
    active: boolean;
    redemptionRule: Object;
    valueRule: Object;
    minInitialBalance: number;
    maxInitialBalance: number;
    fixedInitialBalances: number[];
    fixedInitialUses: number[];
    startDate: string;
    endDate: string;
    metadata: Object;
    createdDate: string;
    updatedDate: string;
}
