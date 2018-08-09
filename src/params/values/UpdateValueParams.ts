import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model/Value";
import {ValueRule} from "../../model/ValueRule";
import {RedemptionRule} from "../../model/RedemptionRule";

export interface UpdateValueParams {
    valueId: string;
    params: {
        contactId?: string;
        preTax?: boolean;
        active?: boolean;
        frozen?: boolean;
        canceled?: boolean;
        redemptionRule?: RedemptionRule;
        valueRule?: ValueRule;
        discount?: boolean;
        discountSellerLiability?: number;
        startDate?: string;
        endDate?: string;
        tags?: string[];
        metadata?: object;
    };
}

export interface UpdateValueResponse extends LightrailResponse<Value> {
}