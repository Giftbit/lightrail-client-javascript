import {Value} from "../../model/Value";
import {LightrailResponse} from "../LightrailResponse";
import {BalanceRule} from "../../model/BalanceRule";
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
    balanceRule?: BalanceRule;
    usesRemaining?: number;
    pretax?: boolean;
    startDate?: string;
    endDate?: string;
    metadata?: object;
}

export interface CreateValueRespone extends LightrailResponse<Value> {
}