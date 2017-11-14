import * as chai from "chai";
import * as jsonwebtoken from "jsonwebtoken";
import * as index from "./";

describe("index", () => {
    describe("configure()", () => {
        after(() => {
            index.configure({
                apiKey: "",
                restRoot: "https://api.lightrail.com/v1/"
            });
        });

        it("can set api key and restRoot", () => {
            index.configure({
                apiKey: "abcd",
                restRoot: "http://www.example.com/"
            });

            chai.assert.equal(index.configuration.apiKey, "abcd");
            chai.assert.equal(index.configuration.restRoot, "http://www.example.com/");
        });
    });

    describe("generateShopperToken()", () => {
        it("signs a contactId", () => {
            index.configure({
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjp7Imd1aSI6Imdvb2V5In19.uQR5JntsoZE_ECtIHosoucFjX-4k4Kx8C82-XsjGBwM",
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
                apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjp7Imd1aSI6Imdvb2V5In19.uQR5JntsoZE_ECtIHosoucFjX-4k4Kx8C82-XsjGBwM",
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
    });
});
