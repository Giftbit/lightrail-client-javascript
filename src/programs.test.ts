import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";

describe("programs", () => {
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
            const program = await Lightrail.programs.getProgram(testID);

            chai.assert.isNotNull(program);
            chai.assert.isString(program.body.id);
            chai.assert.equal(program.body.id, testID);
            chai.assert.equal(program.body.currency, "USD");
            chai.assert.equal(program.body.name, "javascript programs unit test");
        });
    });

    describe("getPrograms(filterParams)", () => {
        it("gets the programs", async () => {
            const programs = await Lightrail.programs.listPrograms();

            chai.assert.isNotNull(programs);
            chai.assert.isArray(programs.body);
            chai.assert.isTrue(!!programs.body.length);
        });
    });

    // UPDATE
    describe("updateProgram(id, params)", () => {
        it("changes the currency", async () => {
            const program = await Lightrail.programs.updateProgram(testID, {name: "the new name"});

            chai.assert.isNotNull(program);
            chai.assert.isString(program.body.id);
            chai.assert.equal(program.body.id, testID);
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

// Issuance
describe("/programs/issuance", () => {
    before(() => {
        chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
        Lightrail.configure({
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });
    });

    const programID = "testIssuanceID";
    const testIssanceID = uuid.v4().substring(0, 24);

    describe("createProgram()", () => {
        it("creates a program", async () => {
            await Lightrail.programs.createProgram({
                id: programID,
                name: "javascript programs unit test",
                currency: "USD",
            }).catch(r => (true));
        });
    });

    // CREATE
    describe("createIssuance(params)", () => {
        it("successfully generates and issuance", async () => {
            await Lightrail.programs.createIssuance(programID, {
                id: testIssanceID,
                count: 10,
                balance: 500,
                generateCode: {}
            });
        });
    });

    // READ
    describe("listIssuances(program, params)", function () {
        it("lists our new issuance", async () => {
            const issuance = await Lightrail.programs.listIssuances(programID);

            chai.assert.isNotNull(issuance);
            chai.assert.isArray(issuance.body);
            chai.assert.notEqual(issuance.body.findIndex(issuance => issuance.id === testIssanceID), -1);
        });
    });

    describe("getIssuance(program, issuance)", function () {
        it("lists our new issuance", async () => {
            const issuance = await Lightrail.programs.getIssuance(programID, testIssanceID);
            chai.assert.isNotNull(issuance);
            chai.assert.isString(issuance.body.id);
            chai.assert.equal(issuance.body.id, testIssanceID);
        });
    });
});