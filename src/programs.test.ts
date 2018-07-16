import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";

describe.only("programs", () => {
    before(() => {
        chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
        Lightrail.configure({
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });
    });

    const testID = uuid.v4().substring(0, 24);
    
    // CREATE
    describe("createProgram()", () => {
        it("creates a program", async () => {
            const program = await Lightrail.programs.createProgram({
                id: testID,
                name: "javascript programs unit test",
                currency: "USD",
            });

            chai.assert.isNotNull(program);
            chai.assert.isString(program.body.id);
            chai.assert.equal(program.body.id, testID);
        });
    });


    // READ
    describe("getProgram(id)", () => {
        it("gets the right program", async () => {
            const program = await Lightrail.programs.getProgramById(testID);

            chai.assert.isNotNull(program);
            chai.assert.isString(program.body.id);
            chai.assert.equal(program.body.id, testID);
            chai.assert.equal(program.body.currency, "USD");
            chai.assert.equal(program.body.name, "javascript programs unit test");
        });
    });

    describe("getPrograms(filterParams)", () => {
        it("gets the programs", async () => {
            const programs = await Lightrail.programs.getPrograms();

            chai.assert.isNotNull(programs);
            chai.assert.isArray(programs.body);
            chai.assert.isTrue(!!programs.body.length);
        });
    });

    // UPDATE
    describe("updateProgram(id, params)", () => {
        it("changes the currency", async () => {
            const program = await Lightrail.programs.updateProgram({id: testID, currency: "CAD", name: "the new name"});

            chai.assert.isNotNull(program);
            chai.assert.isString(program.body.id);
            chai.assert.equal(program.body.id, testID);
            chai.assert.equal(program.body.currency, "CAD");
            chai.assert.equal(program.body.name, "the new name");
        });
    });

    // DELETE
    describe("deleteProgram()", () => {
        it("deletes a program", async () => {
            const deleted = await Lightrail.programs.deleteProgram(testID);

            chai.assert.isNotNull(deleted);
            chai.assert.isTrue(deleted.body.success);
        });
    });
});
