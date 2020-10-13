import {Value} from "../../model";
import {LightrailResponse} from "../LightrailResponse";
import {BalanceRule} from "../../model";
import {RedemptionRule} from "../../model";
import {GenericCodeOptions} from "../../model";
import {DiscountSellerLiabilityRule} from "../../model";
import {CodeGenerationParams} from "..";

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
    /** @deprecated since v4.3.0 - use DiscountSellerLiabilityRule instead. */
    discountSellerLiability?: number;
    discountSellerLiabilityRule?: DiscountSellerLiabilityRule;
    generateCode?: CodeGenerationParams;
    genericCodeOptions?: GenericCodeOptions;
    redemptionRule?: RedemptionRule;
    balanceRule?: BalanceRule;
    usesRemaining?: number;
    pretax?: boolean;
    startDate?: string;
    endDate?: string;
    metadata?: object;
}

export interface CreateValueQueryParams {
    showCode?: boolean;
}

export interface CreateValueResponse extends LightrailResponse<Value> {
}
