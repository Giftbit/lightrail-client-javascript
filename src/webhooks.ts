import * as crypto from "crypto";
import {configuration} from "./index";

export function verifySignature(signatureHeader: string, webhookSecret: string, payload: string): boolean {
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