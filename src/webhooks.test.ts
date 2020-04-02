import {verifySignature} from "./webhooks";
import * as chai from "chai";

describe("webhooks", () => {

    const secret = "ABCDE";
    const payload = '{"id":"1","nested":{"num":1,"bool":false}}';
    const goodSignature = "828c719f4e058351f153d76221ebff6ab240cc20ed56ca54783dcf766e6eb3c9";

    it("can validate a good signature", () => {
        chai.assert.isTrue(verifySignature(goodSignature, secret, payload));
    });

    it("can validate a good and bad signature", () => {
        const signatureHeader = `${goodSignature},bad`;
        chai.assert.isTrue(verifySignature(signatureHeader, secret, payload));
    });

    it("can validate a bad and good signature", () => {
        const signatureHeader = `bad,${goodSignature}`;
        chai.assert.isTrue(verifySignature(signatureHeader, secret, payload));
    });

    it("can invalidate a bad signature", () => {
        const signatureHeader = "wrong";
        chai.assert.isFalse(verifySignature(signatureHeader, secret, payload));
    });

    it("can invalidate two bad signatures", () => {
        const signatureHeader = "bad,alsoBad";
        chai.assert.isFalse(verifySignature(signatureHeader, secret, payload));
    });

    it("can't validate without providing signatureHeader", () => {
        try {
            verifySignature(null, secret, payload);
            chai.assert.fail("this should not happen");
        } catch (e) {
            // do nothing, test passes
        }
    });

    it("can't validate without providing signatureHeader", () => {
        try {
            verifySignature(goodSignature, null, payload);
            chai.assert.fail("this should not happen");
        } catch (e) {
            // do nothing, test passes
        }
    });

    it("can't validate without providing signatureHeader", () => {
        try {
            verifySignature(goodSignature, secret, null);
            chai.assert.fail("this should not happen");
        } catch (e) {
            // do nothing, test passes
        }
    });
});