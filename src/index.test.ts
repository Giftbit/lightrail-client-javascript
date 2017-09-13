import * as chai from "chai";
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

            chai.assert.equal(index.apiKey, "abcd");
            chai.assert.equal(index.restRoot, "http://www.example.com/");
        });
    });
});
