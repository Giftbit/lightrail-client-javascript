import * as chai from "chai";
import * as Lightrail from "./index";
import chaiExclude from "chai-exclude";
import {CreateCurrencyParams, UpdateCurrencyParams} from "./params";
import {Currency} from "./model/Currency";

chai.use(chaiExclude);

describe("currencies", () => {

    const testCurrencyCode = "XXS";

    before(async () => {
        Lightrail.configure({
            restRoot: process.env.LIGHTRAIL_API_PATH || "",
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });

        // This set of tests adds a currency with code XXS and delete it at the end.
        // In case it doesn't delete in a previous run attempt to delete before.
        await Lightrail.currencies.deleteCurrency(testCurrencyCode);
    });

    let currency: Currency;
    it("can create a currency", async () => {
        const createParams: CreateCurrencyParams = {
            code: testCurrencyCode,
            name: "Some Fake Dollars",
            symbol: "$",
            decimalPlaces: 0
        };
        currency = (await Lightrail.currencies.createCurrency(createParams)).body;
        chai.assert.deepEqualExcluding(currency as any, createParams, ["createdBy", "createdDate", 'updatedDate']);
        chai.assert.isNotNull(currency.createdBy);
        chai.assert.isNotNull(currency.createdDate);
        chai.assert.isNotNull(currency.updatedDate);
    });

    it("should return a limited list", async () => {
        chai.assert.isNotNull(currency, "this test depends on the create");

        const list = await Lightrail.currencies.listCurrencies();
        chai.assert.isArray(list.body);
        chai.assert.hasAllKeys(list.body[0], Object.keys(currency));
    });

    it("can get currency", async () => {
        chai.assert.isNotNull(currency, "this test depends on the create");

        const get = await Lightrail.currencies.getCurrency(currency.code);
        chai.assert.deepEqual(get.body, currency);
    });

    it("can update currency", async () => {
        chai.assert.isNotNull(currency, "this test depends on the create");

        const updateParams: UpdateCurrencyParams = {
            name: "Forever Bucks",
            symbol: "))<>(("
        };
        const update = await Lightrail.currencies.updateCurrency(currency.code, updateParams);
        chai.assert.deepEqualExcluding(update.body, {...currency, ...updateParams}, ["updatedDate"]);
    });

    it("can delete currency", async () => {
        chai.assert.isNotNull(currency, "this test depends on the create");

        const del = await Lightrail.currencies.deleteCurrency(currency.code);
        chai.assert.isNotNull(del);
        chai.assert.isTrue(del.body.success);
    });
});
