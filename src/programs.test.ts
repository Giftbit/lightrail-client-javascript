import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";

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
            const id = uuid.v4();
            const program = await Lightrail.programs.createProgram({
                id,
                name: "javascript programs unit test",
                currency: "USD",
            });
            chai.assert.isNotNull(program);
            chai.assert.isString(program.id);
            chai.assert.equal(program.id, id);
        });
    });
});
