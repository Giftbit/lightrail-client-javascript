import {LightrailResponse} from "../../LightrailResponse";
import {Issuance} from "../../../model/Issuance";

export interface GetIssuanceParams {
    programId: string;
    issuanceId: string;
}

export interface GetIssuanceResponse extends LightrailResponse<Issuance> {
}