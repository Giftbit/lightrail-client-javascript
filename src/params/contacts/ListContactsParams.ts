import {Contact} from "../../model";
import {FilterableString} from "../FilterableParams";
import {PaginatedLightrailResponse} from "../LightrailResponse";
import {PaginationParams} from "../PaginationParams";
import {ContentTypeParams} from "../ContentTypeParams";

export interface ListContactsParams extends PaginationParams, ContentTypeParams {
    id?: FilterableString;
    tags?: FilterableString;
    firstName?: FilterableString;
    lastName?: FilterableString;
    email?: FilterableString;
    valueId?: FilterableString;
}

export interface ListContactsResponse extends PaginatedLightrailResponse<Array<Contact>> {
}