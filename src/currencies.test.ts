import * as chai from "chai";
import * as Lightrail from "./index";

describe("currencies", () => {
    const Currency = {
        code: "XXS",
        name: "Some Fake Dollars",
        symbol: "$",
        decimalPlaces: 2
    };

    describe("createCurrency(currency)", () => {
        it("creates " + Currency.code + " Currency", async () => {
            const currency = await Lightrail.currencies.createCurrency(Currency);

            chai.assert.isNotNull(currency);
            chai.assert.deepEqual(currency.body, Currency);
        });
    });

    describe("listCurrencies({limit})", function () {
        it("should return a limited list", async () => {
            const currencies = await Lightrail.currencies.listCurrencies();

            chai.assert.isNotNull(currencies);
            chai.assert.isArray(currencies.body);
            chai.assert.hasAllKeys(currencies.body[0], ["code", "name", "symbol", "decimalPlaces"]);
        });
    });

    describe("getCurrency(code)", () => {
        it("should return our newly created currency", async () => {
            const currency = await Lightrail.currencies.getCurrency(Currency.code);

            chai.assert.isNotNull(currency);
            chai.assert.deepEqual(currency.body, Currency);
            chai.assert.hasAllKeys(currency.body, ["code", "name", "symbol", "decimalPlaces"]);
        });
    });

    describe("updateCurrency(code, {})", () => {
        it("should update our currency with a new name and symbol", async () => {
            const currency = await Lightrail.currencies.updateCurrency(Currency.code, {
                name: "Forever Bucks",
                symbol: "))<>(("
            });

            chai.assert.isNotNull(currency);
            chai.assert.hasAllKeys(currency.body, ["code", "name", "symbol", "decimalPlaces"]);
            chai.assert.equal(currency.body.name, "Forever Bucks");
            chai.assert.equal(currency.body.symbol, "))<>((");
        });
    });

    describe("deleteCurrency(code)", () => {
        it("should delete our gross new currency", async () => {
            const deleted = await Lightrail.currencies.deleteCurrency(Currency);

            chai.assert.isNotNull(deleted);
            chai.assert.isTrue(deleted.body.success);
        });
    });
});