import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {v4 as uuid} from "uuid";
import * as Lightrail from "./";
import {SimulateTransactionParams} from "./params/SimulateTransactionParams";

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
            Lightrail.configure({
                apiKey: process.env.LIGHTRAIL_API_KEY,
            });
            // TODO: add test to ensure required env vars are set: very good error message here
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
