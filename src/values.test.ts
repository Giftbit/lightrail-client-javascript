import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";
import {CreateValueParams} from "./params/values/CreateValueParams";

describe("values", () => {
    before(() => {
        chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
        Lightrail.configure({
            apiKey: process.env.LIGHTRAIL_API_KEY || ""
        });
    });

    const testValueId = "testValue";
    const testValue: CreateValueParams = {
        id: testValueId,
        currency: "USD",
        uses: 1,
        code: uuid.v4().substring(0, 12),
        active: true,
        metadata: {
            deepestFear: "spiders"
        }
    };

    describe("createValue(value)", () => {
        it("creates the expected value", async () => {
            const value = await Lightrail.values.createValue(testValue);

            chai.assert.isNotNull(value);
            chai.assert.isNotNull(value.body);
            chai.assert.isString(value.body.id);
            chai.assert.equal(value.body.id, testValueId);
            chai.assert.equal(value.body.programId, testValue.programId);
            chai.assert.equal(value.body.currency, testValue.currency);
            chai.assert.equal(value.body.metadata["deepestFear"], testValue.metadata["deepestFear"]);
        });
    });

    describe("getValue(id, showCode)", () => {
        it("gets the value with the code", async () => {
            const value = await Lightrail.values.getValue({valueId: testValueId, params: {showCode: true}});

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
            const value = await Lightrail.values.getValue({valueId: testValueId, params: {showCode: false}});

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
            const value = await Lightrail.values.getValue({valueId: testValueId, params: {showCode: true}});

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
            const value = await Lightrail.values.updateValue({valueId: testValueId, params: updates});

            chai.assert.isNotNull(value);
            chai.assert.isNotNull(value.body);
            chai.assert.isFalse(value.body.active);
            chai.assert.isTrue(value.body.frozen);
        });
    });

    describe("changeValuesCode(value, {code}", () => {
        it("changes the code", async () => {
            const value = await Lightrail.values.changeValuesCode({
                valueId: testValueId,
                params: {code: "haberdashery"}
            });

            chai.assert.isNotNull(value);
            chai.assert.isNotNull(value.body);
            chai.assert.equal(value.body.code, "…hery");
        });
    });

    describe("deleteValue(value)", () => {
        it("successful delete", async () => {
            const response = await Lightrail.values.deleteValue({valueId: testValueId});

            chai.assert.isNotNull(response);
            chai.assert.isNotNull(response.body);
            chai.assert.isTrue(response.body.success);
        });
    });
});