import {LightrailResponse} from "../../model/LightrailResponse";
import {Value} from "../../model/Value";
import {ValueRule} from "../../model/ValueRule";

export interface UpdateValueParams {
    contactId?: string;
    preTax?: boolean;
    active?: boolean;
    frozen?: boolean;
    canceled?: boolean;
    redemptionRule?: Object;
    valueRule?: ValueRule;
    discount?: boolean;
    discountSellerLiability?: number;
    startDate?: string;
    endDate?: string;
    tags?: string[];
    metadata?: Object;
}

export interface UpdateValueResponse extends LightrailResponse<Value> {
}