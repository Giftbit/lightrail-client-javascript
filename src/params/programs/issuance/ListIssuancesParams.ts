import {LightrailResponse} from "../../LightrailResponse";
import {Issuance} from "../../../model/Issuance";

export interface ListIssuancesParams {
    programId: string;
}

export interface ListIssuancesResponse extends LightrailResponse<Issuance[]> {
}