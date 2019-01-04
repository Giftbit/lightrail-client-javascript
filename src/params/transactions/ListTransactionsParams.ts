import {PaginationParams} from "../PaginationParams";
import {PaginatedLightrailResponse} from "../LightrailResponse";
import {Transaction} from "../../model";
import {FilterableString} from "../FilterableParams";
import {ContentTypeParams} from "../ContentTypeParams";

export interface ListTransactionsParams extends PaginationParams {
    transactionType?: FilterableString;
    createdDate?: FilterableString;
    valueId?: string;
}

export interface ListTransactionsResponse extends PaginatedLightrailResponse<Array<Transaction>> {
}