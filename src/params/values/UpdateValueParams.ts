import {LightrailResponse} from "../../model/LightrailResponse";
import {Value} from "../../model/Value";

export interface UpdateValueParams {
    contactId?: string;
    preTax?: boolean;
    active?: boolean;
    frozen?: boolean;
    canceled?: boolean;
    redemptionRule?: Object;
    valueRule?: Object;
    discount?: boolean;
    discountSellerLiability?: number;
    startDate?: string;
    endDate?: string;
    tags?: string[];
    metadata?: Object;
}

export interface UpdateValueResponse extends LightrailResponse<Value> {
}