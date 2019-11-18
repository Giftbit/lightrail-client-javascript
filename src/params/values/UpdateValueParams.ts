import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model";
import {BalanceRule} from "../../model";
import {RedemptionRule} from "../../model";
import {DiscountSellerLiabilityRule} from "../../model";

export interface UpdateValueParams {
    contactId?: string;
    pretax?: boolean;
    active?: boolean;
    frozen?: boolean;
    canceled?: boolean;
    redemptionRule?: RedemptionRule;
    balanceRule?: BalanceRule;
    discount?: boolean;
    /** @deprecated since v4.3.0 - use DiscountSellerLiabilityRule instead. */
    discountSellerLiability?: number;
    discountSellerLiabilityRule?: DiscountSellerLiabilityRule;
    startDate?: string;
    endDate?: string;
    tags?: string[];
    metadata?: object;
}

export interface UpdateValueResponse extends LightrailResponse<Value> {
}