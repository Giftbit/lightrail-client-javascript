import {Contact} from "../../model";
import {FilterableString} from "../FilterableParams";
import {PaginatedLightrailResponse} from "../LightrailResponse";
import {PaginationParams} from "../PaginationParams";

export interface ListContactsParams extends PaginationParams {
    id?: FilterableString;
    tags?: FilterableString;
    firstName?: FilterableString;
    lastName?: FilterableString;
    email?: FilterableString;
}

export interface ListContactsResponse extends PaginatedLightrailResponse<Array<Contact>> {
}