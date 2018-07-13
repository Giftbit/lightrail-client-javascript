import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";

describe("currencies", () => {
    const Currency = {
        code: uuid.v4().substring(0, 3),
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
});