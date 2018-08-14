import {PaginatedLightrailResponse} from "../../LightrailResponse";
import {Issuance} from "../../../model/Issuance";
import {PaginationParams} from "../../PaginationParams";

export interface ListIssuancesParams extends PaginationParams {
}

export interface ListIssuancesResponse extends PaginatedLightrailResponse<Issuance[]> {
}