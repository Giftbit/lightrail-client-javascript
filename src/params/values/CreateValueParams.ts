import {LightrailResponse} from "../../../dist/model/LightrailResponse";
import {Value} from "../../model/Value";

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
    redemptionRule?: Object;
    valueRule?: Object;
    uses?: number;
    startDate?: string;
    endDate?: string;
    metadata?: Object;
}

export interface CreateValueRespone extends LightrailResponse<Value> {
}