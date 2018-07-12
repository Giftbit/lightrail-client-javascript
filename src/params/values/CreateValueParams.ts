import {LightrailResponse} from "../../../dist/model/LightrailResponse";
import {Value} from "../../model/Value";

export interface CreateValueParams {
    id: string;
    programId?: string;
    contactId?: string;
    code?: string;
    isGenericCode?: boolean;
    currency?: string;
    balance?: number;
    preTax?: boolean;
    active?: boolean;
    frozen?: boolean;
    discount?: boolean;
    discountSellerLiability?: number;
    redemptionRule?: Object;
    valueRule?: Object;
    uses?: number;
    startDate?: string;
    endDate?: string;
    tags?: string[];
    metadata?: Object;
}

export interface CreateValueRespone extends LightrailResponse<Value> {
}