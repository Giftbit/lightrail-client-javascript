import * as crypto from "crypto";
import * as lightrail from "./index";
import {configuration, LightrailRequestError} from "./index";
import {formatResponse, isSuccessStatus} from "./requestUtils";
import {Webhook} from "./model";
import {
    CreateWebhookParams,
    CreateWebhookResponse,
    GetWebhookResponse,
    ListWebhooksResponse,
    UpdateWebhookParams,
    UpdateWebhookResponse
} from "./params";

export function verifySignature(signatureHeader: string, payload: string, webhookSecret?: string): boolean {
    const secret = webhookSecret ? webhookSecret : configuration.webhookSecret;
    if (!signatureHeader) {
        throw new Error("The signatureHeader cannot be null");
    }
    if (!secret) {
        throw new Error("The webhookSecret cannot be null");
    }
    if (!payload) {
        throw new Error("The payload cannot be null");
    }

    const eventSignatures = signatureHeader.split(",");
    const signature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

    // constant time string comparison to prevent timing attacks (see: https://codahale.com/a-lesson-in-timing-attacks)
    return eventSignatures.reduce((prev, cur) => prev || (cur.length === signature.length && crypto.timingSafeEqual(Buffer.from(cur), Buffer.from(signature))), false);
}

export async function createWebhook(params: CreateWebhookParams): Promise<CreateWebhookResponse> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.id) {
        throw new Error("params.id not set");
    }

    const resp = await lightrail.request("POST", "webhooks").send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

export async function getWebhook(webhook: string | Webhook): Promise<GetWebhookResponse> {
    const webhookId = getWebhookId(webhook);

    const resp = await lightrail.request("GET", `webhooks/${encodeURIComponent(webhookId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

export async function listWebhooks(): Promise<ListWebhooksResponse> {
    const resp = await lightrail.request("GET", "webhooks");
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

export async function updateWebhook(webhook: string | Webhook, params: UpdateWebhookParams): Promise<UpdateWebhookResponse> {
    const webhookId = getWebhookId(webhook);

    const resp = await lightrail.request("PATCH", `webhooks/${encodeURIComponent(webhookId)}`).send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

export async function deleteWebhook(webhook: string | Webhook): Promise<void> {
    const webhookId = getWebhookId(webhook);

    const resp = await lightrail.request("DELETE", `webhooks/${encodeURIComponent(webhookId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return;
    }

    throw new LightrailRequestError(resp);
}

/**
 * Get webhookId from the string (as the ID itself) or Webhook object.
 */
export function getWebhookId(webhook: string | Webhook): string {
    if (!webhook) {
        throw new Error("webhook not set");
    } else if (typeof webhook === "string") {
        return webhook;
    } else if (webhook.id) {
        return webhook.id;
    } else {
        throw new Error("webhook must be a string for webhookId or a Webhook object");
    }
}
