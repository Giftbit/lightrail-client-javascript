import * as chai from "chai";
import * as Lightrail from "./index";

describe("webhooks", () => {

    before(async () => {
        Lightrail.configure({
            restRoot: process.env.LIGHTRAIL_API_PATH || "",
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });
    });

    const secret = "ABCDE";
    const payload = '{"id":"1","nested":{"num":1,"bool":false}}';
    const goodSignature = "828c719f4e058351f153d76221ebff6ab240cc20ed56ca54783dcf766e6eb3c9";

    it("can validate a good signature", () => {
        chai.assert.isTrue(Lightrail.webhooks.verifySignature(goodSignature, secret, payload));
    });

    it("can validate a good and bad signature", () => {
        chai.assert.isTrue(Lightrail.webhooks.verifySignature(`${goodSignature},bad`, secret, payload));
    });

    it("can validate a bad and good signature", () => {
        chai.assert.isTrue(Lightrail.webhooks.verifySignature(`bad,${goodSignature}`, secret, payload));
    });

    it("can invalidate a bad signature", () => {
        chai.assert.isFalse(Lightrail.webhooks.verifySignature("wrong", secret, payload));
    });

    it("can invalidate two bad signatures", () => {
        chai.assert.isFalse(Lightrail.webhooks.verifySignature("bad,alsoBad", secret, payload));
    });

    it("can't validate without providing signatureHeader", () => {
        try {
            Lightrail.webhooks.verifySignature(null, secret, payload);
            chai.assert.fail("this should not happen");
        } catch (e) {
            // do nothing, test passes
        }
    });

    it("can't validate without providing signatureHeader", () => {
        try {
            Lightrail.webhooks.verifySignature(goodSignature, null, payload);
            chai.assert.fail("this should not happen");
        } catch (e) {
            // do nothing, test passes
        }
    });

    it("can't validate without providing signatureHeader", () => {
        try {
            Lightrail.webhooks.verifySignature(goodSignature, secret, null);
            chai.assert.fail("this should not happen");
        } catch (e) {
            // do nothing, test passes
        }
    });
});