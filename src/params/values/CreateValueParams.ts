import {Value} from "../../model/Value";
import {LightrailResponse} from "../../model/LightrailResponse";
import {ValueRule} from "../../model/ValueRule";
import {RedemptionRule} from "../../model/RedemptionRule";

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
    redemptionRule?: RedemptionRule;
    valueRule?: ValueRule;
    uses?: number;
    startDate?: string;
    endDate?: string;
    metadata?: Object;
}

export interface CreateValueRespone extends LightrailResponse<Value> {
}