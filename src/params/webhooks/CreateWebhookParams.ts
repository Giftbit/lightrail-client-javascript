import {LightrailResponse} from "../LightrailResponse";
import {Webhook} from "../../model";

export interface CreateWebhookParams {
    id: string;
    url: string;
    events: string[];
    active?: boolean;
}

export interface CreateWebhookResponse extends LightrailResponse<Webhook> {
}
