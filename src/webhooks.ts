import * as crypto from "crypto";
import * as lightrail from "./index";
import {configuration, LightrailRequestError} from "./index";
import {formatResponse, isSuccessStatus} from "./requestUtils";
import {Webhook, WebhookSecret} from "./model";
import {
    CreateWebhookParams,
    CreateWebhookResponse, CreateWebhookSecretResponse,
    GetWebhookResponse, GetWebhookSecretResponse,
    ListWebhooksResponse,
    UpdateWebhookParams,
    UpdateWebhookResponse
} from "./params";

/**
 * Example:
 * ```js
 * const signature = "abcdefg";  // webhook signature
 * const payload = "{}";  // webhook payload JSON string
 * const secret = "the secret stored in your system";
 * const verified = Lightrail.webhooks.verifySignature(signature, payload, secret);
 * ```
 */
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

/**
 * See: https://apidocs.lightrail.com/#operation/CreateWebhook
 *
 * Example:
 * ```js
 * const webhook = await Lightrail.webhooks.createWebhook({
 *     id: "abcdefg",
 *     url: "https://www.example.com/webhook",
 *     events: ["*"]
 * });
 * ```
 */
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

/**
 * See: https://apidocs.lightrail.com/#operation/GetWebhook
 *
 * Example:
 * ```js
 * const webhook = await Lightrail.webhooks.getWebhook("abcdefg");
 * ```
 */
export async function getWebhook(webhook: string | Webhook): Promise<GetWebhookResponse> {
    const webhookId = getWebhookId(webhook);

    const resp = await lightrail.request("GET", `webhooks/${encodeURIComponent(webhookId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/ListWebhooks
 *
 * Example:
 * ```js
 * const webhooks = await Lightrail.webhooks.listWebhooks();
 * ```
 */
export async function listWebhooks(): Promise<ListWebhooksResponse> {
    const resp = await lightrail.request("GET", "webhooks");
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/UpdateWebhook
 *
 * Example:
 * ```js
 * const updatedWebhook = await Lightrail.webhooks.updateWebhook("abcdefg", {url: "https://www.example.com/webhookUpdated"});
 * ```
 */
export async function updateWebhook(webhook: string | Webhook, params: UpdateWebhookParams): Promise<UpdateWebhookResponse> {
    const webhookId = getWebhookId(webhook);

    const resp = await lightrail.request("PATCH", `webhooks/${encodeURIComponent(webhookId)}`).send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/DeleteWebhook
 *
 * Example:
 * ```js
 * await Lightrail.webhooks.deleteWebhook("abcdefg");
 * ```
 */
export async function deleteWebhook(webhook: string | Webhook): Promise<void> {
    const webhookId = getWebhookId(webhook);

    const resp = await lightrail.request("DELETE", `webhooks/${encodeURIComponent(webhookId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return;
    }

    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/CreateSecret
 *
 * Example:
 * ```js
 * const webhookSecret = await Lightrail.webhooks.createWebhookSecret("abcdefg");
 * ```
 */
export async function createWebhookSecret(webhook: string | Webhook): Promise<CreateWebhookSecretResponse> {
    const webhookId = getWebhookId(webhook);

    const resp = await lightrail.request("POST", `webhooks/${encodeURIComponent(webhookId)}/secrets`);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/GetSecret
 *
 * Example:
 * ```js
 * const webhookSecret = await Lightrail.webhooks.getWebhookSecret("abcdefg", "hijklmnop");
 * ```
 */
export async function getWebhookSecret(webhook: string | Webhook, webhookSecret: string | WebhookSecret): Promise<GetWebhookSecretResponse> {
    const webhookId = getWebhookId(webhook);
    const webhookSecretId = getWebhookSecretId(webhookSecret);

    const resp = await lightrail.request("GET", `webhooks/${encodeURIComponent(webhookId)}/secrets/${encodeURIComponent(webhookSecretId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/DeleteSecret
 *
 * Example:
 * ```js
 * await Lightrail.webhooks.deleteWebhookSecret("abcdefg", "hijklmnop");
 * ```
 */
export async function deleteWebhookSecret(webhook: string | Webhook, webhookSecret: string | WebhookSecret): Promise<void> {
    const webhookId = getWebhookId(webhook);
    const webhookSecretId = getWebhookSecretId(webhookSecret);

    const resp = await lightrail.request("DELETE", `webhooks/${encodeURIComponent(webhookId)}/secrets/${encodeURIComponent(webhookSecretId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return;
    }
    throw new LightrailRequestError(resp);
}

/**
 * @internal
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

/**
 * @internal
 * Get webhookSecretId from the string (as the ID itself) or WebhookSecret object.
 */
export function getWebhookSecretId(webhookSecret: string | WebhookSecret): string {
    if (!webhookSecret) {
        throw new Error("webhookSecret not set");
    } else if (typeof webhookSecret === "string") {
        return webhookSecret;
    } else if (webhookSecret.id) {
        return webhookSecret.id;
    } else {
        throw new Error("webhookSecret must be a string for webhookSecretId or a WebhookSecret object");
    }
}
