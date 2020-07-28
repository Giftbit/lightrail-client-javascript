import {WebhookSecret} from "./WebhookSecret";

export interface Webhook {
    id: string;
    url: string;
    events: string[];
    secrets: WebhookSecret[];
    active: boolean;
    createdDate: string;
    updatedDate: string;
    createdBy: string;
}
