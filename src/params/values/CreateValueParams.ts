import {Value} from "../../model";
import {LightrailResponse} from "../LightrailResponse";
import {BalanceRule} from "../../model";
import {RedemptionRule} from "../../model";
import {GenericCodeOptions} from "../../model";
/** @deprecated discountSellerLiability since v4.3.0 - use DiscountSellerLiabilityRule instead. */
import {DiscountSellerLiabilityRule} from "../../model";

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