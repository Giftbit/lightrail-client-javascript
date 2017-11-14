import * as chai from "chai";
import {v4 as uuid} from "uuid";
// require("dotenv").config();    // uncomment or use your preferred way to insert sensitive info where required
import * as Lightrail from "./";
import {SimulateTransactionParams} from "./params/SimulateTransactionParams";

const sampleCard: string = ""; // process.env.CARD_ID;
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
                apiKey: "", // process.env.LIGHTRAIL_API_KEY,
                restRoot: "https://api.lightrail.com/v1/"
            });
        });
        after(() => {
            Lightrail.configure({
                apiKey: "",
                restRoot: "https://api.lightrail.com/v1/"
            });
        });

        it("creates a dry run transaction - minimum params", (done) => {
            Lightrail.cards.transactions.simulateTransaction(sampleCard, simulateChargeParams)
                .then((res) => {
                        chai.assert.equal(res.userSuppliedId, simulateChargeParams.userSuppliedId);
                    }
                )
                .then(() => {
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    return done;
                });
        });

        it("creates a dry run transaction - nsf: false", (done) => {
            Lightrail.cards.transactions.simulateTransaction(sampleCard, nsfChargeParams)
                .then((res) => {
                        chai.assert.exists(res.value);
                    }
                )
                .then(() => {
                    done();
                })
                .catch(done);
        });

        it("throws an error if amount too high and nsf not set to false", (done) => {
            Lightrail.cards.transactions.simulateTransaction(sampleCard, largeChargeParams)
                .then(() => {
                    done(new Error("this should have thrown an error and stopped"));
                })
                .catch(err => done());
        });
    });
});
