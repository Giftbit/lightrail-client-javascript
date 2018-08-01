import {Contact} from "../../model";
import {FilterableString} from "../FilterableParams";
import {PaginatedLightrailResponse} from "../LightrailResponse";
import {PaginationParams} from "../PaginationParams";

export interface GetContactsParams extends PaginationParams {
    id?: FilterableString;
    tags?: FilterableString;
    firstName?: FilterableString;
    lastName?: FilterableString;
    email?: FilterableString;
}

export interface GetContactsResponse extends PaginatedLightrailResponse<Array<Contact>> {
}