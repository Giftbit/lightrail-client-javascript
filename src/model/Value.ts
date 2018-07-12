export interface Value {
    id: string;
    currency: string;
    balance: number;
    uses: number;
    programId: string;
    code: string;
    isGenericCode: boolean;
    contactId: string;
    pretax: boolean;
    active: boolean;
    frozen: boolean;
    canceled: boolean;
    redemptionRule: Object;
    valueRule: Object;
    discount: boolean;
    discountSellerLiability: number;
    startDate: string;
    endDate: string;
    tags: string[];
    metadata: Object;
    createdDate: string;
    updatedDate: string;
}