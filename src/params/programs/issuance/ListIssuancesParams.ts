import {PaginatedLightrailResponse} from "../../LightrailResponse";
import {Issuance} from "../../../model/Issuance";
import {PaginationParams} from "../../PaginationParams";
import {ContentTypeParams} from "../../ContentTypeParams";

export interface ListIssuancesParams extends PaginationParams, ContentTypeParams {
}

export interface ListIssuancesResponse extends PaginatedLightrailResponse<Issuance[]> {
}