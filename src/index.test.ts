import * as chai from "chai";
import * as jsonwebtoken from "jsonwebtoken";
import * as index from "./index";
import {formatFilterParams} from "./requestUtils";
import * as http from "http";

describe("index", () => {
    describe("configure()", () => {
        let mitmInstance: any;

        beforeEach(() => {
            // mitm shims node's internal request/response constructs so they can be intercepted.
            // A similar project called nock works at a higher level but can't do assertions on
            // the header based on the whole request.
            // mitmInstance = mitm();   MITM is currently broken
        });

        afterEach(() => {
            index.configure({
                apiKey: "",
                restRoot: process.env.LIGHTRAIL_API_PATH
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

        it.skip("sets the User-Agent", async () => {
            index.configure({
                apiKey: "abcd"
            });

            let mitmHit = false;
            mitmInstance.on("request", (req: http.IncomingMessage, res: http.ServerResponse) => {
                mitmHit = true;
                chai.assert.match(req.headers["user-agent"] as string, /^Lightrail-JavaScript\/\d+\.\d+\.\d+$/);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({success: true}));
            });

            await index.contacts.createContact({id: "someId", firstName: "Some", lastName: "Name"});
            chai.assert.isTrue(mitmHit);
        });

        it.skip("configure additionalHeaders is set correctly", async () => {
            index.configure({
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
                chai.assert.equal(req.url, "/v1/cards");
                chai.assert.equal(req.headers["headerone"], "this is header one");
                chai.assert.equal(req.headers["headertwo"], "this is header two");
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({success: true}));
            });

            await index.contacts.createContact({id: "someId", firstName: "Some", lastName: "Name"});
            chai.assert.isTrue(mitmHit);
        });
    });

    describe("generateShopperToken()", () => {
        it("signs a contactId", () => {
            index.configure({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjp7Imd1aSI6Imdvb2V5IiwiZ21pIjoiZ2VybWllIn19.XxOjDsluAw5_hdf5scrLk0UBn8VlhT-3zf5ZeIkEld8",
                sharedSecret: "secret"
            });

            const shopperToken = index.generateShopperToken("chauntaktEyeDee", {validityInSeconds: 600});
            chai.assert.isString(shopperToken);

            const payload = jsonwebtoken.verify(shopperToken, "secret") as any;
            chai.assert.isObject(payload);
            chai.assert.deepEqual(payload.g, {
                gui: "gooey",
                gmi: "germie",
                coi: "chauntaktEyeDee"
            });
            chai.assert.equal(payload.iss, "MERCHANT");
            chai.assert.isNumber(payload.iat);
            chai.assert.isNumber(payload.exp);
            chai.assert.equal(payload.exp, payload.iat + 600);
        });

        it("signs an empty contactId", () => {
            index.configure({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjp7Imd1aSI6Imdvb2V5IiwiZ21pIjoiZ2VybWllIn19.XxOjDsluAw5_hdf5scrLk0UBn8VlhT-3zf5ZeIkEld8",
                sharedSecret: "secret"
            });

            const shopperToken = index.generateShopperToken("", {validityInSeconds: 600});
            chai.assert.isString(shopperToken);

            const payload = jsonwebtoken.verify(shopperToken, "secret") as any;
            chai.assert.isObject(payload);
            chai.assert.deepEqual(payload.g, {
                gui: "gooey",
                gmi: "germie",
                coi: ""
            });
            chai.assert.equal(payload.iss, "MERCHANT");
            chai.assert.isNumber(payload.iat);
            chai.assert.isNumber(payload.exp);
            chai.assert.equal(payload.exp, payload.iat + 600);
        });

        it("signs a shopper token with metadata", () => {
            index.configure({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjp7Imd1aSI6Imdvb2V5IiwiZ21pIjoiZ2VybWllIn19.XxOjDsluAw5_hdf5scrLk0UBn8VlhT-3zf5ZeIkEld8",
                sharedSecret: "secret"
            });

            const shopperToken = index.generateShopperToken("zhopherId", {validityInSeconds: 999, metadata: {foo: "xxxYYYzzz"}});
            chai.assert.isString(shopperToken);

            const payload = jsonwebtoken.verify(shopperToken, "secret") as any;
            chai.assert.isObject(payload);
            chai.assert.deepEqual(payload.g, {
                gui: "gooey",
                gmi: "germie",
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
