import {Contact, PaginationParams} from "../../model";
import {FilterableString} from "../FilterableParam";
import {PaginatedLightrailResponse} from "../../model/LightrailResponse";

export interface GetContactsParams extends PaginationParams {
    id?: FilterableString;
    tags?: FilterableString;
    firstName?: FilterableString;
    lastName?: FilterableString;
    email?: FilterableString;
}

export interface GetContactsResponse extends PaginatedLightrailResponse<Array<Contact>> {
}