import * as chai from "chai";
import * as jsonwebtoken from "jsonwebtoken";
import * as http from "http";
import * as mitm from "mitm";
import * as Lightrail from "./index";
import {formatFilterParams} from "./requestUtils";

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
            Lightrail.configure({
                apiKey: "",
                restRoot: process.env.LIGHTRAIL_API_PATH
            });
            if (mitmInstance) {
                mitmInstance.disable();
                mitmInstance = null;
            }
        });

        it("can set api key and restRoot", () => {
            Lightrail.configure({
                apiKey: "abcd",
                restRoot: "http://www.example.com/"
            });

            chai.assert.equal(Lightrail.configuration.apiKey, "abcd");
            chai.assert.equal(Lightrail.configuration.restRoot, "http://www.example.com/");
        });

        it("sets the User-Agent", async () => {
            Lightrail.configure({
                apiKey: "abcd"
            });

            let mitmHit = false;
            mitmInstance.on("request", (req: http.IncomingMessage, res: http.ServerResponse) => {
                mitmHit = true;
                chai.assert.match(req.headers["lightrail-client"] as string, /^Lightrail-JavaScript\/\d+\.\d+\.\d+$/);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({success: true}));
            });

            await Lightrail.contacts.createContact({id: "someId", firstName: "Some", lastName: "Name"});
            chai.assert.isTrue(mitmHit);
        });

        it("configure additionalHeaders is set correctly", async () => {
            Lightrail.configure({
                apiKey: "does.not.matter",
                restRoot: "https://api.lightrail.com/v2/",
                additionalHeaders: {
                    headerone: "this is header one",
                    headertwo: "this is header two"
                }
            });

            let mitmHit = false;
            mitmInstance.on("request", (req: http.IncomingMessage, res: http.ServerResponse) => {
                mitmHit = true;
                chai.assert.equal(req.method, "POST");
                chai.assert.equal(req.headers["host"], "api.lightrail.com");
                chai.assert.equal(req.url, "/v2/contacts");
                chai.assert.equal(req.headers["headerone"], "this is header one");
                chai.assert.equal(req.headers["headertwo"], "this is header two");
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({success: true}));
            });

            await Lightrail.contacts.createContact({id: "someId", firstName: "Some", lastName: "Name"});
            chai.assert.isTrue(mitmHit);
        });
    });

    describe("request()", () => {
        let mitmInstance: any;

        before(() => {
            // Not that we're making real requests but the library won't even
            // try without the apiKey set.
            Lightrail.configure({
                restRoot: process.env.LIGHTRAIL_API_PATH || "",
                apiKey: process.env.LIGHTRAIL_API_KEY || "",
            });
        });

        beforeEach(() => {
            mitmInstance = mitm();
        });

        afterEach(() => {
            if (mitmInstance) {
                mitmInstance.disable();
                mitmInstance = null;
            }
        });

        it("retries GET requests", async () => {
            let reqCount = 0;

            mitmInstance.on("request", (req: http.IncomingMessage, res: http.ServerResponse) => {
                switch (reqCount++) {
                    case 0:
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({statusCode: 500, message: "Oh oh!"}));
                        break;
                    default:
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({
                            id: "foo",
                            firstName: "first",
                            lastName: "last",
                            email: "foo@example.com",
                            metadata: {},
                            createdDate: new Date().toISOString(),
                            updatedDate: new Date().toISOString(),
                            createdBy: "me"
                        }));
                }
            });

            const contact = await Lightrail.contacts.getContact("foo");
            chai.assert.equal(reqCount, 2);
            chai.assert.equal(contact.status, 200);
            chai.assert.equal(contact.body.id, "foo");
        });

        it("retries POST requests", async () => {
            let reqCount = 0;

            mitmInstance.on("request", (req: http.IncomingMessage, res: http.ServerResponse) => {
                switch (reqCount++) {
                    case 0:
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({statusCode: 500, message: "Oh oh!"}));
                        break;
                    default:
                        res.statusCode = 201;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({
                            id: "foo",
                            firstName: "first",
                            lastName: "last",
                            email: "foo@example.com",
                            metadata: {},
                            createdDate: new Date().toISOString(),
                            updatedDate: new Date().toISOString(),
                            createdBy: "me"
                        }));
                }
            });

            const contact = await Lightrail.contacts.createContact({
                id: "foo", firstName: "first",
                lastName: "last",
                email: "foo@example.com"
            });
            chai.assert.equal(reqCount, 2);
            chai.assert.equal(contact.status, 201);
            chai.assert.equal(contact.body.id, "foo");
        });
    });

    describe("generateShopperToken()", () => {
        it("signs a contactId", () => {
            Lightrail.configure({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjp7Imd1aSI6Imdvb2V5IiwiZ21pIjoiZ2VybWllIiwidG1pIjoidGVlbWllIn19.Xb8x158QIV2ukGuQ3L5u4KPrL8MC-BToabnzKMQy7oc",
                sharedSecret: "secret"
            });

            const shopperToken = Lightrail.generateShopperToken("chauntaktEyeDee", {validityInSeconds: 600});
            chai.assert.isString(shopperToken);

            const payload = jsonwebtoken.verify(shopperToken, "secret") as any;
            chai.assert.isObject(payload);
            chai.assert.deepEqual(payload.g, {
                gui: "gooey",
                gmi: "germie",
                tmi: "teemie",
                coi: "chauntaktEyeDee"
            });
            chai.assert.equal(payload.iss, "MERCHANT");
            chai.assert.isNumber(payload.iat);
            chai.assert.isNumber(payload.exp);
            chai.assert.equal(payload.exp, payload.iat + 600);
        });

        it("signs an empty contactId", () => {
            Lightrail.configure({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjp7Imd1aSI6Imdvb2V5IiwiZ21pIjoiZ2VybWllIiwidG1pIjoidGVlbWllIn19.Xb8x158QIV2ukGuQ3L5u4KPrL8MC-BToabnzKMQy7oc",
                sharedSecret: "secret"
            });

            const shopperToken = Lightrail.generateShopperToken("", {validityInSeconds: 600});
            chai.assert.isString(shopperToken);

            const payload = jsonwebtoken.verify(shopperToken, "secret") as any;
            chai.assert.isObject(payload);
            chai.assert.deepEqual(payload.g, {
                gui: "gooey",
                gmi: "germie",
                tmi: "teemie",
                coi: ""
            });
            chai.assert.equal(payload.iss, "MERCHANT");
            chai.assert.isNumber(payload.iat);
            chai.assert.isNumber(payload.exp);
            chai.assert.equal(payload.exp, payload.iat + 600);
        });

        it("signs a shopper token with metadata", () => {
            Lightrail.configure({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjp7Imd1aSI6Imdvb2V5IiwiZ21pIjoiZ2VybWllIiwidG1pIjoidGVlbWllIn19.Xb8x158QIV2ukGuQ3L5u4KPrL8MC-BToabnzKMQy7oc",
                sharedSecret: "secret"
            });

            const shopperToken = Lightrail.generateShopperToken("zhopherId", {
                validityInSeconds: 999,
                metadata: {foo: "xxxYYYzzz"}
            });
            chai.assert.isString(shopperToken);

            const payload = jsonwebtoken.verify(shopperToken, "secret") as any;
            chai.assert.isObject(payload);
            chai.assert.deepEqual(payload.g, {
                gui: "gooey",
                gmi: "germie",
                tmi: "teemie",
                coi: "zhopherId"
            });
            chai.assert.deepEqual(payload.metadata, {
                foo: "xxxYYYzzz"
            });
            chai.assert.equal(payload.iss, "MERCHANT");
            chai.assert.isNumber(payload.iat);
            chai.assert.isNumber(payload.exp);
            chai.assert.equal(payload.exp, payload.iat + 999);
        });

        it("fails if the API key does not have a `tmi`", () => {
            Lightrail.configure({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjp7Imd1aSI6Imdvb2V5IiwiZ21pIjoiZ2VybWllIn19.XxOjDsluAw5_hdf5scrLk0UBn8VlhT-3zf5ZeIkEld8",
                sharedSecret: "secret"
            });

            chai.assert.throws(() => {
                Lightrail.generateShopperToken("chauntaktEyeDee", {validityInSeconds: 600});
            });
        });
    });

    describe("formatFilterParams(p)", () => {
        it("handles null or blank params object", () => {
            chai.assert.deepEqual(formatFilterParams({}), {});
            chai.assert.deepEqual(formatFilterParams(null), {});
        });

        it("doesn't modify a normal object", () => {
            const obj = {test: 1, test2: "test2"};
            chai.assert.deepEqual(formatFilterParams(obj), obj);
        });

        it("formats objects with nested values in the key.key format", () => {
            const obj = {test: 1, test2: "test2", test3: {gt: 4, lt: 8}};
            chai.assert.deepEqual(formatFilterParams(obj), {test: 1, test2: "test2", "test3.gt": 4, "test3.lt": 8});
        });
    });
});
