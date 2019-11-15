import {Value} from "../../model/Value";
import {LightrailResponse} from "../LightrailResponse";
import {BalanceRule} from "../../model/BalanceRule";
import {RedemptionRule} from "../../model/RedemptionRule";
import {GenericCodeOptions} from "../../model/GenericCodeOptions";
import {DiscountSellerLiabilityRule} from "../../model/DiscountSellerLiabilityRule";

export interface CreateValueParams {
    id: string;
    currency: string;
    contactId?: string;
    programId?: string;
    code?: string;
    isGenericCode?: boolean;
    balance?: number;
    active?: boolean;
    frozen?: boolean;
    discount?: boolean;
    discountSellerLiability?: number;
    discountSellerLiabilityRule?: DiscountSellerLiabilityRule;
    genericCodeOptions?: GenericCodeOptions;
    redemptionRule?: RedemptionRule;
    balanceRule?: BalanceRule;
    usesRemaining?: number;
    pretax?: boolean;
    startDate?: string;
    endDate?: string;
    metadata?: object;
}

export interface CreateValueResponse extends LightrailResponse<Value> {
}