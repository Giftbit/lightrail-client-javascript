import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model/Value";
import {BalanceRule} from "../../model/BalanceRule";
import {RedemptionRule} from "../../model/RedemptionRule";
import {DiscountSellerLiabilityRule} from "../../model/DiscountSellerLiabilityRule";

export interface UpdateValueParams {
    contactId?: string;
    pretax?: boolean;
    active?: boolean;
    frozen?: boolean;
    canceled?: boolean;
    redemptionRule?: RedemptionRule;
    balanceRule?: BalanceRule;
    discount?: boolean;
    discountSellerLiability?: number;
    discountSellerLiabilityRule?: DiscountSellerLiabilityRule;
    startDate?: string;
    endDate?: string;
    tags?: string[];
    metadata?: object;
}

export interface UpdateValueResponse extends LightrailResponse<Value> {
}