import {LightrailResponse} from "../../model/LightrailResponse";
import {Value} from "../../model/Value";
import {FilterableNumber, FilterableString} from "../FilterableParam";

export interface GetValuesParams extends Partial<{
    limit: number;
    showCode: boolean;
    programId: FilterableString;
    currency: FilterableString;
    contactId: FilterableString;
    balance: FilterableNumber;
    uses: FilterableNumber;
    discount: boolean;
    active: boolean;
    frozen: boolean;
    canceled: boolean;
    preTax: boolean;
    startDate: FilterableString;
    endDate: FilterableString;
    createdDate: FilterableString;
    updatedDate: FilterableString;
    tags: FilterableString;
}> {
}

export interface GetValuesResponse extends LightrailResponse<Array<Value>> {
}