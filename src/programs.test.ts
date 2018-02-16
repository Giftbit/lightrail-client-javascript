import * as chai from "chai";
import * as Lightrail from "./";
import * as uuid from "uuid";
import {ValueStore} from "./model";

describe("programs", () => {
    before(() => {
        chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
        chai.assert.isString(process.env.CARD_ID, "env var CARD_ID must be set ot run the tests (for example set it in the .env file)");
        Lightrail.configure({
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });
    });

    describe("createProgram()", () => {
        it("creates a program", async () => {
            const userSuppliedId = uuid.v4();
            const program = await Lightrail.programs.createProgram({
                userSuppliedId,
                name: "javascript programs unit test",
                valueStoreType: ValueStore.ValueStoreType.PRINCIPAL,
                currency: "USD",
                codeMinValue: 89,
                codeMaxValue: 9889
            });
            chai.assert.isNotNull(program);
            chai.assert.isString(program.programId);
            chai.assert.equal(program.userSuppliedId, userSuppliedId);
        });
    });
});
