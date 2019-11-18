import {BalanceRule} from "./BalanceRule";
import {RedemptionRule} from "./RedemptionRule";
import {GenericCodeOptions} from "./GenericCodeOptions";
import {DiscountSellerLiabilityRule} from "./DiscountSellerLiabilityRule";

export interface Value {
    id: string;
    currency: string;
    balance: number;
    balanceRule: BalanceRule;
    usesRemaining: number;
    programId: string;
    code: string;
    isGenericCode: boolean;
    genericCodeOptions: GenericCodeOptions;
    attachedFromValueId: string;
    contactId: string;
    pretax: boolean;
    active: boolean;
    frozen: boolean;
    canceled: boolean;
    redemptionRule: RedemptionRule;
    discount: boolean;
    /** @deprecated since v4.3.0 - use DiscountSellerLiabilityRule instead. */
    discountSellerLiability: number;
    discountSellerLiabilityRule: DiscountSellerLiabilityRule;
    startDate: string;
    endDate: string;
    tags: string[];
    metadata: object;
    createdDate: string;
    updatedDate: string;
    createdBy: string;
}
