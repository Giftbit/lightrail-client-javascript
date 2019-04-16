import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";
import chaiExclude from "chai-exclude";
import {CreateIssuanceParams, CreateProgramParams} from "./params";

chai.use(chaiExclude);

describe("programs", () => {
    before(() => {
        Lightrail.configure({
            restRoot: process.env.LIGHTRAIL_API_PATH || "",
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });
    });

    const testID = uuid.v4().substring(0, 24);

    // CREATE
    describe("createProgram()", () => {
        it("creates a program", async () => {
            const request: CreateProgramParams = {
                id: testID,
                name: "javascript programs unit test",
                currency: "USD",
                discount: false,
                discountSellerLiability: null,
                pretax: false,
                active: true,
                redemptionRule: {
                    rule: "1 == 1",
                    explanation: "true"
                },
                balanceRule: {
                    rule: "100",
                    explanation: "$1",
                },
                minInitialBalance: null, // must be null if balanceRule
                maxInitialBalance: null, // must be null if balanceRule
                fixedInitialBalances: null, // must be null if balanceRule
                fixedInitialUsesRemaining: [1],
                startDate: new Date("3030-01-01").toISOString(),
                endDate: new Date("4040-01-01").toISOString(),
                metadata: {
                    description: "a whole lotta program"
                }
            };
            const program = await Lightrail.programs.createProgram(request);
            chai.assert.isNotNull(program);
            chai.assert.deepEqualExcluding(program.body, request,
                [
                    "startDate", "endDate", "createdBy", "createdDate", "updatedDate"
                ] as any);
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

////////////////////
// Issuance
describe("/programs/issuance", () => {
    before(() => {
        chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set to run the tests (for example set it in the .env file)");
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
                name: "Custom Issuance Name",
                count: 10,
                balance: 500,
                generateCode: {}
            });
        });
    });

    describe("createIssuance(params) with usesRemaining and balanceRule", () => {
        it("successfully generates and issuance", async () => {
            const request: CreateIssuanceParams = {
                id: uuid.v4().substring(0, 24),
                name: "Custom Issuance Name",
                count: 1,
                balanceRule: {
                    rule: "100",
                    explanation: "$1"
                },
                usesRemaining: 1,
                generateCode: {}
            };
            const issuance = await Lightrail.programs.createIssuance(programID, request);
            chai.assert.deepEqual(issuance.body.balanceRule, request.balanceRule);
            chai.assert.equal(issuance.body.usesRemaining, request.usesRemaining);
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

        it("limits response", async () => {
            const issuance = await Lightrail.programs.listIssuances(programID, {limit: 1});

            chai.assert.isNotNull(issuance);
            chai.assert.isArray(issuance.body);
            chai.assert.equal(issuance.body.length, 1);
            chai.assert.equal(issuance.limit, 1);
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
