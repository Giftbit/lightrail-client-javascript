import * as chai from "chai";
import * as Lightrail from "./index";

describe("webhooks", () => {

    const secret = "ABCDE";
    const payload = '{"id":"1","nested":{"num":1,"bool":false}}';
    const goodSignature = "828c719f4e058351f153d76221ebff6ab240cc20ed56ca54783dcf766e6eb3c9";

    it("can validate a good signature", () => {
        chai.assert.isTrue(Lightrail.webhooks.verifySignature(goodSignature, payload, secret));
    });

    it("can validate a signature if there is a good signature accompanied by a bad signature in signatureHeader", () => {
        chai.assert.isTrue(Lightrail.webhooks.verifySignature(`${goodSignature},bad`, payload, secret));
    });

    it("can validate a signature if there is a bad signature accompanied by a good signature in signatureHeader", () => {
        chai.assert.isTrue(Lightrail.webhooks.verifySignature(`bad,${goodSignature}`, payload, secret));
    });

    it("can invalidate a bad signature", () => {
        chai.assert.isFalse(Lightrail.webhooks.verifySignature("bad", payload, secret));
    });

    it("can invalidate two bad signatures", () => {
        chai.assert.isFalse(Lightrail.webhooks.verifySignature("bad,alsoBad", payload, secret));
    });

    it("can't validate without providing signatureHeader", () => {
        try {
            Lightrail.webhooks.verifySignature(null, payload, secret);
            chai.assert.fail("this should not happen");
        } catch (e) {
            // do nothing, test passes
        }
    });

    it("can't validate without providing payload", () => {
        try {
            Lightrail.webhooks.verifySignature(goodSignature, null, secret);
            chai.assert.fail("this should not happen");
        } catch (e) {
            // do nothing, test passes
        }
    });

    it("can't validate without providing webhookSecret or configuration secret", () => {
        chai.assert.isNull(Lightrail.configuration.webhookSecret);
        try {
            Lightrail.webhooks.verifySignature(goodSignature, payload);
            chai.assert.fail("this should not happen");
        } catch (e) {
            // do nothing, test passes
        }
    });

    it("can validate by setting configuration webhookSecret", () => {
        Lightrail.configure({webhookSecret: secret});
        chai.assert.isTrue(Lightrail.webhooks.verifySignature(goodSignature, payload, null));
    });

    it("can override configuration webhookSecret by passing secret into method", () => {
        Lightrail.configure({webhookSecret: "bad"});
        chai.assert.isFalse(Lightrail.webhooks.verifySignature(goodSignature, payload), "this should be false because Lightrail was configured with a bad webhook secret");
        chai.assert.isTrue(Lightrail.webhooks.verifySignature(goodSignature, payload, secret));
    })
});