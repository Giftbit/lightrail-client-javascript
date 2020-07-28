import {Webhook} from "../../model";
import {LightrailResponse} from "../LightrailResponse";

export interface ListWebhooksResponse extends LightrailResponse<Webhook[]> {
}
