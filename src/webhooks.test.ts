import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";

describe("webhooks", () => {

    before(async () => {
        Lightrail.configure({
            restRoot: process.env.LIGHTRAIL_API_PATH || "",
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });
    });

    describe("verifySignature()", () => {
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

    const webhookId = uuid.v4().substring(0, 20);

    describe("createWebhook()", () => {
        it("creates a webhook", async () => {
            const webhook = await Lightrail.webhooks.createWebhook({
                id: webhookId,
                url: `https://www.example.com/${webhookId}`,
                events: ["*"]
            });

            chai.assert.isNotNull(webhook.body);
            chai.assert.isString(webhook.body.id);
            chai.assert.equal(webhook.body.id, webhookId);
            chai.assert.equal(webhook.body.url, `https://www.example.com/${webhookId}`);
            chai.assert.deepEqual(webhook.body.events, ["*"]);
            chai.assert.isTrue(webhook.body.active);
        });
    });

    describe("listWebhooks()", () => {
        it("lists webhooks", async () => {
            const webhooks = await Lightrail.webhooks.listWebhooks();

            chai.assert.isNotNull(webhooks.body);
            chai.assert.isArray(webhooks.body);
            chai.assert.equal(webhooks.body.filter(c => (c.id === webhookId)).length, 1);
        });
    });

    describe("getWebhook()", () => {
        it("gets the expected webhook", async () => {
            const webhook = await Lightrail.webhooks.getWebhook(webhookId);

            chai.assert.isNotNull(webhook);
            chai.assert.isString(webhook.body.id);
            chai.assert.equal(webhook.body.id, webhookId);

            const webhookByWebhook = await Lightrail.webhooks.getWebhook(webhook.body);
            chai.assert.deepEqual(webhookByWebhook.body, webhook.body);
        });
    });

    describe("updateWebhook()", () => {
        it("changes url, active", async () => {
            const updatedWebhook = await Lightrail.webhooks.updateWebhook(webhookId, {
                url: `https://www.example.com/${webhookId}/disabled`,
                active: false
            });

            chai.assert.isNotNull(updatedWebhook);
            chai.assert.isString(updatedWebhook.body.id);
            chai.assert.equal(updatedWebhook.body.id, webhookId);
            chai.assert.equal(updatedWebhook.body.url, `https://www.example.com/${webhookId}/disabled`);
            chai.assert.isFalse(updatedWebhook.body.active);
        });
    });

    describe("createWebhookSecret()", () => {
        it("creates a webhook secret", async () => {
            const webhookSecret = await Lightrail.webhooks.createWebhookSecret(webhookId);

            chai.assert.isNotNull(webhookSecret.body);
            chai.assert.isString(webhookSecret.body.id);
            chai.assert.isString(webhookSecret.body.secret);

            const webhook = await Lightrail.webhooks.getWebhook(webhookId);
            chai.assert.lengthOf(webhook.body.secrets, 2, "assuming the above create works");
        });
    });

    describe("getWebhookSecret()", () => {
        it("get a webhook secret", async () => {
            const webhook = await Lightrail.webhooks.getWebhook(webhookId);

            for (const webhookSecret of webhook.body.secrets) {
                const webhookSecretGet = await Lightrail.webhooks.getWebhookSecret(webhook.body, webhookSecret);

                chai.assert.isNotNull(webhookSecretGet.body);
                chai.assert.isString(webhookSecretGet.body.id);
                chai.assert.equal(webhookSecretGet.body.id, webhookSecret.id);
            }
        });
    });

    describe("deleteWebhookSecret()", () => {
        it("deletes a webhook secret", async () => {
            const webhookBeforeDelete = await Lightrail.webhooks.getWebhook(webhookId);
            chai.assert.isAbove(webhookBeforeDelete.body.secrets.length, 1, "has at least 1 secret to delete");

            await Lightrail.webhooks.deleteWebhookSecret(webhookBeforeDelete.body, webhookBeforeDelete.body.secrets[0]);

            const deletedWebhookSecret = await Lightrail.webhooks.getWebhookSecret(webhookId, webhookBeforeDelete.body.secrets[0]);
            chai.assert.isNull(deletedWebhookSecret.body);
            chai.assert.equal(deletedWebhookSecret.status, 404);

            const webhookAfterDelete = await Lightrail.webhooks.getWebhook(webhookId);
            chai.assert.equal(webhookAfterDelete.body.secrets.length, webhookBeforeDelete.body.secrets.length - 1);
        });
    });

    describe("deleteWebhook()", () => {
        it("deletes our webhook using the id", async () => {
            await Lightrail.webhooks.deleteWebhook(webhookId);

            const webhook = await Lightrail.webhooks.getWebhook(webhookId);
            chai.assert.isNull(webhook.body);
            chai.assert.equal(webhook.status, 404);
        });
    });
});
