import * as chai from "chai";
import * as jsonwebtoken from "jsonwebtoken";
import * as index from "./";
import * as http from "http";
import mitm = require("mitm");

describe("index", () => {
    describe("configure()", () => {
        let mitmInstance: any;

        beforeEach(() => {
            // mitm shims node's internal request/response constructs so they can be intercepted.
            // A similar project called nock works at a higher level but can't do assertions on
            // the header based on the whole request.
            mitmInstance = mitm();
        });

        afterEach(() => {
            index.configure({
                apiKey: "",
                restRoot: "https://api.lightrail.com/v1/"
            });
            if (mitmInstance) {
                mitmInstance.disable();
                mitmInstance = null;
            }
        });

        it("can set api key and restRoot", () => {
            index.configure({
                apiKey: "abcd",
                restRoot: "http://www.example.com/"
            });

            chai.assert.equal(index.configuration.apiKey, "abcd");
            chai.assert.equal(index.configuration.restRoot, "http://www.example.com/");
        });

        it("configure additionalHeaders is set correctly", async () => {
            index.configure({
                apiKey: "does.not.matter",
                restRoot: "https://api.lightrail.com/v1/",
                additionalHeaders: {
                    headerone: "this is header one",
                    headertwo: "this is header two"
                }
            });

            mitmInstance.on("request", (req: http.IncomingMessage, res: http.ServerResponse) => {
                console.log(JSON.stringify(req.headers));
                chai.assert.equal(req.method, "POST");
                chai.assert.equal(req.headers["host"], "api.lightrail.com");
                chai.assert.equal(req.url, "/v1/cards");
                chai.assert.equal(req.headers["headerone"], "this is header one");
                chai.assert.equal(req.headers["headertwo"], "this is header two");
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({success: true}));
            });

            const res = await index.cards.createCard({userSuppliedId: "someId", cardType: "ACCOUNT_CARD"})
        });
    });

    describe("generateShopperToken()", () => {
        it("signs a contactId", () => {
            index.configure({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjp7Imd1aSI6Imdvb2V5IiwiZ21pIjoiZ2VybWllIn19.XxOjDsluAw5_hdf5scrLk0UBn8VlhT-3zf5ZeIkEld8",
                sharedSecret: "secret"
            });

            const shopperToken = index.generateShopperToken({contactId: "chauntaktEyeDee"}, 600);
            chai.assert.isString(shopperToken);

            const payload = jsonwebtoken.verify(shopperToken, "secret") as any;
            chai.assert.isObject(payload);
            chai.assert.deepEqual(payload.g, {
                gui: "gooey",
                coi: "chauntaktEyeDee"
            });
            chai.assert.equal(payload.iss, "MERCHANT");
            chai.assert.isNumber(payload.iat);
            chai.assert.isNumber(payload.exp);
            chai.assert.equal(payload.exp, payload.iat + 600);
        });

        it("signs a contact userSuppliedId", () => {
            index.configure({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjp7Imd1aSI6Imdvb2V5IiwiZ21pIjoiZ2VybWllIn19.XxOjDsluAw5_hdf5scrLk0UBn8VlhT-3zf5ZeIkEld8",
                sharedSecret: "secret"
            });

            const shopperToken = index.generateShopperToken({userSuppliedId: "luserSuppliedId"}, 600);
            chai.assert.isString(shopperToken);

            const payload = jsonwebtoken.verify(shopperToken, "secret") as any;
            chai.assert.isObject(payload);
            chai.assert.deepEqual(payload.g, {
                gui: "gooey",
                cui: "luserSuppliedId"
            });
            chai.assert.equal(payload.iss, "MERCHANT");
            chai.assert.isNumber(payload.iat);
            chai.assert.isNumber(payload.exp);
            chai.assert.equal(payload.exp, payload.iat + 600);
        });

        it("signs a shopperId", () => {
            index.configure({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjp7Imd1aSI6Imdvb2V5IiwiZ21pIjoiZ2VybWllIn19.XxOjDsluAw5_hdf5scrLk0UBn8VlhT-3zf5ZeIkEld8",
                sharedSecret: "secret"
            });

            const shopperToken = index.generateShopperToken({shopperId: "zhopherId"}, 600);
            chai.assert.isString(shopperToken);

            const payload = jsonwebtoken.verify(shopperToken, "secret") as any;
            chai.assert.isObject(payload);
            chai.assert.deepEqual(payload.g, {
                gui: "gooey",
                shi: "zhopherId"
            });
            chai.assert.equal(payload.iss, "MERCHANT");
            chai.assert.isNumber(payload.iat);
            chai.assert.isNumber(payload.exp);
            chai.assert.equal(payload.exp, payload.iat + 600);
        });
    });
});