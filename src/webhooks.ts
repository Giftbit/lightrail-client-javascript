import * as crypto from "crypto";

export function verifySignature(signatureHeader: string, secret: string, payload: string): boolean {
    if (!signatureHeader) {
        throw new Error("The signatureHeader cannot be null");
    }
    if (!signatureHeader) {
        throw new Error("The secret cannot be null");
    }
    if (!signatureHeader) {
        throw new Error("The payload cannot be null");
    }

    const eventSignatures = signatureHeader.split(",");
    const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    // constant time string comparison to prevent timing attacks (see: https://codahale.com/a-lesson-in-timing-attacks)
    return eventSignatures.reduce((prev, cur) => prev || crypto.timingSafeEqual(Buffer.from(cur), Buffer.from(signature)), false);
}