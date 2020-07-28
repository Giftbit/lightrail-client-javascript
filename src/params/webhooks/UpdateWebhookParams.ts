import {LightrailResponse} from "../LightrailResponse";
import {Webhook} from "../../model";

export interface UpdateWebhookParams {
    url?: string;
    events?: string[];
    active?: boolean;
}

export interface UpdateWebhookResponse extends LightrailResponse<Webhook> {
}
