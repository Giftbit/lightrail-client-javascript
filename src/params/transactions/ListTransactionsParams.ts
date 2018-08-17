import {PaginationParams} from "../PaginationParams";
import {PaginatedLightrailResponse} from "../LightrailResponse";
import {Transaction} from "../../model";
import {FilterableString} from "../FilterableParams";

export interface ListTransactionsParams extends PaginationParams {
    transactionType: FilterableString;
    createdDate: FilterableString;
}

export interface ListTransactionsResponse extends PaginatedLightrailResponse<Array<Transaction>> {
}