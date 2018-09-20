import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";
import chaiExclude = require("chai-exclude");
import {CreateValueParams} from "./params/values/CreateValueParams";
chai.use(chaiExclude);

describe("values", () => {
    before(() => {
        chai.assert.isString(process.env.LIGHTRAIL_API_PATH, "env var LIGHTRAIL_API_PATH must be set ot run the tests (for example set it in the .env file)");
        chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
        Lightrail.configure({
            restRoot: process.env.LIGHTRAIL_API_PATH || "",
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });
    });

    const testValueId = uuid.v4().substring(0, 24);
    const testValue: CreateValueParams = {
        id: testValueId,
        currency: "USD",
        code: uuid.v4().substring(0, 12),
        contactId: null,
        isGenericCode: false,
        balance: 500,
        active: true,
        frozen: false,
        discount: true,
        pretax: true,
        discountSellerLiability: 1,
        redemptionRule: {
            rule: "1 == 1",
            explanation: "true"
        },
        balanceRule: null,
        usesRemaining: 1,
        startDate: new Date("3030-01-01").toISOString(),
        endDate: new Date("4040-01-01").toISOString(),
        metadata: {
            deepestFear: "spiders"
        }
    };

    describe("createValue(value)", () => {
        it("creates the expected value", async () => {
            const value = await Lightrail.values.createValue(testValue);

            chai.assert.isNotNull(value);
            chai.assert.deepEqualExcluding(value.body, testValue,
                [
                    "startDate", "endDate", "createdBy", "createdDate", "updatedDate", "code", "issuanceId", "updatedContactIdDate", "canceled", "programId",
                    "uses" /* this has been deprecated in V2 to usesRemaining but is still being returned */,
                    "valueRule" /* this has been deprecated in V2 to balanceRule but is still being returned */
                ]);
        });
    });

    describe("createValue(value) all properties", () => {
        it("creates the expected value", async () => {
            let request = {
                id: uuid.v4().substring(0, 24),
                currency: "USD",
                balanceRule: {
                    rule: "500",
                    explanation: "$5"
                }
            };

            const value = await Lightrail.values.createValue(request);
            chai.assert.isNotNull(value);
            chai.assert.deepEqual(value.body.balanceRule, request.balanceRule);
        });
    });

    describe("getValue(id, showCode)", () => {
        it("gets the value with the code", async () => {
            const value = await Lightrail.values.getValue(testValueId, {showCode: true});

            chai.assert.isNotNull(value);
            chai.assert.isNotNull(value.body);
            chai.assert.isString(value.body.id);
            chai.assert.equal(value.body.id, testValueId);
            chai.assert.isString(value.body.code);
            chai.assert.equal(value.body.programId, testValue.programId);
            chai.assert.equal(value.body.currency, testValue.currency);
            chai.assert.equal(value.body.metadata["deepestFear"], testValue.metadata["deepestFear"]);
        });
        it("gets the value without the code", async () => {
            const value = await Lightrail.values.getValue(testValueId, {showCode: false});

            chai.assert.isNotNull(value);
            chai.assert.isNotNull(value.body);
            chai.assert.isString(value.body.id);
            chai.assert.equal(value.body.id, testValueId);
            chai.assert.match(value.body.code, /…\-[A-z0-9]{3}/);
            chai.assert.equal(value.body.programId, testValue.programId);
            chai.assert.equal(value.body.currency, testValue.currency);
            chai.assert.equal(value.body.metadata["deepestFear"], testValue.metadata["deepestFear"]);
        });
        it("gets the value using the value instead of the id", async () => {
            const value = await Lightrail.values.getValue(testValueId, {showCode: true});

            chai.assert.isNotNull(value);
            chai.assert.isNotNull(value.body);
            chai.assert.isString(value.body.id);
            chai.assert.equal(value.body.id, testValueId);
            chai.assert.isString(value.body.code);
            chai.assert.equal(value.body.programId, testValue.programId);
            chai.assert.equal(value.body.currency, testValue.currency);
            chai.assert.equal(value.body.metadata["deepestFear"], testValue.metadata["deepestFear"]);
        });
    });

    describe("getValues(filters)", () => {
        it("gets values", async () => {
            const values = await Lightrail.values.listValues();

            chai.assert.isNotNull(values);
            chai.assert.isNotNull(values.body);
            chai.assert.isTrue(!!values.body.length);
        });

        it("gets values with a pagination limit", async () => {
            const values = await Lightrail.values.listValues({limit: 1});

            chai.assert.isNotNull(values);
            chai.assert.isNotNull(values.body);
            chai.assert.isTrue(!!values.body.length);
            chai.assert.equal(values.body.length, 1);
        });
    });

    describe("updateValue(value, updates)", () => {
        it("updates our value as expected", async () => {
            const updates = {active: false, frozen: true};
            const value = await Lightrail.values.updateValue(testValueId, updates);

            chai.assert.isNotNull(value);
            chai.assert.isNotNull(value.body);
            chai.assert.isFalse(value.body.active);
            chai.assert.isTrue(value.body.frozen);
        });
    });

    describe("changeValuesCode(value, {code}", () => {
        it("changes the code", async () => {
            const value = await Lightrail.values.changeValuesCode(
                testValueId,
                {code: uuid.v4().substring(0, 7)+"haberdashery"}
            );

            chai.assert.isNotNull(value);
            chai.assert.isNotNull(value.body);
            chai.assert.equal(value.body.code, "…hery");
        });
    });

    describe("deleteValue(value)", () => {
        const valueId = uuid.v4().substring(0, 24);
        it("create a value with 0 balance so that no transactions are created so that it can be deleted", async () => {
            const value = await Lightrail.values.createValue({
                id: valueId,
                currency: "USD",
                balance: 0
            });
            chai.assert.isNotNull(value.body);
        });


        it("successful delete", async () => {
            const response = await Lightrail.values.deleteValue(valueId);
            chai.assert.isNotNull(response);
            chai.assert.isNotNull(response.body);
            chai.assert.isTrue(response.body.success);
        });
    });
});