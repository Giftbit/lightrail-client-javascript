import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";
import {getTransaction, listTransactions} from "./transactions";

describe("transactions", () => {
    const sourceValueId = "transferSoruceValueTest";
    const valueId = "transactionTestValueId";

    before(async () => {
        before(() => {
            chai.assert.isString(process.env.LIGHTRAIL_API_PATH, "env var LIGHTRAIL_API_PATH must be set ot run the tests (for example set it in the .env file)");
            chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
            Lightrail.configure({
                restRoot: process.env.LIGHTRAIL_API_PATH || "",
                apiKey: process.env.LIGHTRAIL_API_KEY || "",
            });
        });

        const value = await Lightrail.values.getValue(valueId);

        if (!value) {
            await Lightrail.values.createValue({
                id: valueId,
                code: "TRANSACTION_TEST_CODE",
                currency: "USD",
                balance: 0 // must be 0 for totals test
            });
        }

        const srcValue = await Lightrail.values.getValue(sourceValueId);

        if (!srcValue) {
            await Lightrail.values.createValue({
                id: sourceValueId,
                code: "TRANSACTION_SOURCE_CODE",
                currency: "USD",
                balance: 0
            });
        }
    });

    const creditId = uuid.v4().substring(0, 24);

    describe("credit()", () => {
        it("successfully creates a credit transaction", async () => {
            const credit = await Lightrail.transactions.credit({
                id: creditId,
                currency: "USD",
                amount: 100000,
                destination: {
                    rail: "lightrail",
                    valueId: valueId
                }
            });

            chai.assert.isNotNull(credit);
            chai.assert.equal(credit.body.transactionType, "credit");
        });
    });

    describe("checkout()", () => {
        it("successfully creates a checkout transaction", async () => {
            const transaction = await Lightrail.transactions.checkout({
                id: uuid.v4().substring(0, 24),
                currency: "USD",
                lineItems: [
                    {
                        productId: "pedals",
                        unitPrice: 100000,
                        taxRate: 0
                    }
                ],
                sources: [
                    {
                        rail: "lightrail",
                        code: "TRANSACTION_TEST_CODE"
                    }
                ]
            });

            chai.assert.isNotNull(transaction);
            chai.assert.equal(transaction.body.transactionType, "checkout");
            chai.assert.deepEqual(transaction.body.totals, {
                discount: 0,
                discountLightrail: 0,
                paidInternal: 0,
                paidLightrail: 100000,
                paidStripe: 0,
                payable: 100000,
                remainder: 0,
                subtotal: 100000,
                tax: 0,
            });
        });
    });

    describe("transfer", () => {
        it("successfully creates a transfer transaction", async () => {
            const updateSource = await Lightrail.transactions.credit({
                id: uuid.v4().substring(0, 24),
                currency: "USD",
                amount: 5000,
                destination: {
                    rail: "lightrail",
                    valueId: sourceValueId
                }
            });

            const transfer = await Lightrail.transactions.transfer({
                id: uuid.v4().substring(0, 24),
                currency: "USD",
                amount: 5000,
                source: {
                    rail: "lightrail",
                    valueId: sourceValueId
                },
                destination: {
                    rail: "lightrail",
                    valueId: valueId
                }
            });

            chai.assert.isNotNull(transfer);
            chai.assert.equal(transfer.body.transactionType, "transfer");
        });
    });

    describe("debit()", () => {
        it("successfully creates a credit transaction", async () => {
            const transaction = await Lightrail.transactions.debit({
                id: uuid.v4().substring(0, 24),
                currency: "USD",
                amount: 5000,
                source: {
                    rail: "lightrail",
                    valueId: valueId
                }
            });

            chai.assert.isNotNull(transaction);
            chai.assert.equal(transaction.body.transactionType, "debit");
        });
    });

    describe("getTransaction()", () => {
        it("successfully fetches a transaction by id", async () => {
            const transaction = await getTransaction(creditId);

            chai.assert.isNotNull(transaction);
            chai.assert.equal(transaction.body.transactionType, "credit");
        });
    });

    describe("listTransactions()", () => {
        it("successfully gets a list of transactions", async () => {
            const transactions = await listTransactions();

            chai.assert.isNotNull(transactions);
            chai.assert.notEqual(transactions.body.length, 0);
        });
    });
});
