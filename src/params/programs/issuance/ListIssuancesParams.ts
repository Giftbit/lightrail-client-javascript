import {PaginatedLightrailResponse} from "../../LightrailResponse";
import {Issuance} from "../../../model/Issuance";

export interface ListIssuancesParams {
    programId: string;
}

export interface ListIssuancesResponse extends PaginatedLightrailResponse<Issuance[]> {
}