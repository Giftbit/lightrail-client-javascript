import {PaginatedLightrailResponse} from "../LightrailResponse";
import {Value} from "../../model/Value";
import {FilterableNumber, FilterableString} from "../FilterableParams";
import {PaginationParams} from "../PaginationParams";

export interface ListValuesParams extends PaginationParams {
    csv?: boolean;
    issuanceId?: string;
    showCode?: boolean;
    programId?: FilterableString;
    currency?: FilterableString;
    code?: FilterableString;
    contactId?: FilterableString;
    balance?: FilterableNumber;
    usesRemaining?: FilterableNumber;
    discount?: boolean;
    active?: boolean;
    frozen?: boolean;
    canceled?: boolean;
    pretax?: boolean;
    startDate?: FilterableString;
    endDate?: FilterableString;
    createdDate?: FilterableString;
    updatedDate?: FilterableString;
    tags?: FilterableString;
}

export interface ListValuesResponse extends PaginatedLightrailResponse<Array<Value>> {
}