import * as chai from "chai";
import * as Lightrail from "./index";
import {formatFilterParams, validateRequiredParams} from "./requestUtils";
import {listContacts} from "./contacts";

describe("requestUtils", () => {
    before(() => {
        Lightrail.configure({
            restRoot: process.env.LIGHTRAIL_API_PATH || "",
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });
    });

    describe("validateRequiredParams()", () => {
        it("throws errors when params are missing", () => {
            chai.assert.throws(validateRequiredParams.bind(this, ["missing1", "missing2"], {
                hasthis: true,
                missing1: true
            }));
        });

        it("returns true when all params are there", () => {
            chai.assert.isTrue(validateRequiredParams(["missing1", "missing2"], {
                missing1: "Actually it's here",
                missing2: "I'm here too!"
            }));
        });
    });

    describe("formatFilterParams()", () => {
        it("flattens 1 layer deep as promised", () => {
            const preFormatted = {key: "sup", key1: {subkey1: "hey", subkey2: "oh hai"}, key2: {subkey: "wut?"}};
            const expectedOutput = {
                key: "sup",
                ["key1.subkey1"]: "hey",
                ["key1.subkey2"]: "oh hai",
                ["key2.subkey"]: "wut?"
            };

            chai.assert.deepEqual(formatFilterParams(preFormatted), expectedOutput);
        });
    });

    describe("formatResponse(res:Response)", () => {
        it("formats a getContacts response correctely", async () => {
            const response = await listContacts({limit: 10});

            chai.assert.isNumber(response.limit);
            chai.assert.equal(response.limit, 10);
            chai.assert.isNumber(response.maxLimit);

            chai.assert.isArray(response.body);
            chai.assert.isNotNull(response.links);
        });
    });
});
