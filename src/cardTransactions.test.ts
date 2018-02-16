import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as Lightrail from "./";
import {v4 as uuid} from "uuid";
import {SimulateTransactionParams} from "./params";

chai.use(chaiAsPromised);

const sampleCard: string = process.env.CARD_ID;
const simulateChargeParams: SimulateTransactionParams = {
    userSuppliedId: uuid(),
    value: -1,
    currency: "USD",
};
const nsfChargeParams: SimulateTransactionParams = {
    userSuppliedId: uuid(),
    value: -100000000,
    currency: "USD",
    nsf: false
};
const largeChargeParams: SimulateTransactionParams = {
    userSuppliedId: uuid(),
    value: -100000000,
    currency: "USD",
};

describe("cardTransactions", () => {
    describe("simulateTransaction()", () => {
        before(() => {
            chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
            chai.assert.isString(process.env.CARD_ID, "env var CARD_ID must be set ot run the tests (for example set it in the .env file)");
            Lightrail.configure({
                apiKey: process.env.LIGHTRAIL_API_KEY || "",
            });
        });

        it("creates a dry run transaction - minimum params", async () => {
            const res = await Lightrail.cards.transactions.simulateTransaction(sampleCard, simulateChargeParams);
            chai.assert.equal(res.userSuppliedId, simulateChargeParams.userSuppliedId);
        });

        it("creates a dry run transaction - nsf: false", async () => {
            const res = await Lightrail.cards.transactions.simulateTransaction(sampleCard, nsfChargeParams);
            chai.assert.exists(res.value);
        });

        it("throws an error if amount too high and nsf not set to false", async () => {
            await chai.assert.isRejected(Lightrail.cards.transactions.simulateTransaction(sampleCard, largeChargeParams));
        });
    });
});
