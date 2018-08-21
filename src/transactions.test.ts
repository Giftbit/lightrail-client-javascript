import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";
import {getTransaction, listTransactions} from "./transactions";

describe("transactions", () => {
    const sourceValueId = "transferSoruceValueTest";
    const valueId = "transactionTestValueId";

    before(async () => {
        chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
        Lightrail.configure({
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });

        const value = await Lightrail.values.getValue(valueId);

        if (!value) {
            await Lightrail.values.createValue({
                id: valueId,
                code: "TRANSACTION_TEST_CODE",
                currency: "USD",
                balance: 0
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

            console.log(credit.body);

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
                        code: "THISIS_THE_TEST_VALUE_CODE"
                    }
                ]
            });

            chai.assert.isNotNull(transaction);
            chai.assert.equal(transaction.body.transactionType, "checkout");
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