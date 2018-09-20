import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model";
import {PaginationParams} from "../PaginationParams";
import {FilterableNumber, FilterableString} from "../FilterableParams";

export interface ListContactsValuesParams extends PaginationParams {
    programId?: FilterableString;
    currency?: FilterableString;
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

export interface ListContactsValuesResponse extends LightrailResponse<Array<Value>> {
}