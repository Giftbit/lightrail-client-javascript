import {Contact} from "../../model";
import {FilterableString} from "../FilterableParam";
import {LightrailResponse} from "../../model/LightrailResponse";

export interface GetContactsParams {
    id?: FilterableString;
    tags?: FilterableString;
    firstName?: FilterableString;
    lastName?: FilterableString;
    email?: FilterableString;
}

export interface GetContactsResponse extends LightrailResponse<Array<Contact>> {
}