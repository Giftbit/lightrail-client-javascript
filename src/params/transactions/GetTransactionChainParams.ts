import {Transaction} from "../../model";
import {LightrailResponse} from "../LightrailResponse";

export interface GetTransactionChainResponse extends LightrailResponse<Transaction> {
}