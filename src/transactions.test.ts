import * as chai from "chai";
import * as Lightrail from "./index";
import * as uuid from "uuid";
import {getTransaction, listTransactions} from "./transactions";
import {LightrailTransactionStep} from "./model";

describe("transactions", () => {
    const sourceValueId = "transferSoruceValueTest1";
    const valueId = "transactionTestValueId1";

    before(async () => {
        before(() => {
            Lightrail.configure({
                restRoot: process.env.LIGHTRAIL_API_PATH || "",
                apiKey: process.env.LIGHTRAIL_API_KEY || "",
            });
        });

        const value = await Lightrail.values.getValue(valueId);

        if (!value.body) {
            await Lightrail.values.createValue({
                id: valueId,
                code: "TRANSACTION_TEST_CODE_1",
                currency: "USD",
                usesRemaining: 100,
                balance: 0 // must be 0 for totals test
            });
        }

        const srcValue = await Lightrail.values.getValue(sourceValueId);

        if (!srcValue.body) {
            await Lightrail.values.createValue({
                id: sourceValueId,
                code: "TRANSACTION_SOURCE_CODE_1",
                currency: "USD",
                usesRemaining: 100,
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

        it("successfully creates a credit transaction with uses instead of amount", async () => {
            const credit = await Lightrail.transactions.credit({
                id: uuid.v4().substring(0, 24),
                currency: "USD",
                uses: 2,
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
                        code: "TRANSACTION_TEST_CODE_1"
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

    describe("transfer()", () => {
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
        it("successfully creates a debit transaction", async () => {
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

        it("successfully creates a debit transaction with uses instead of amount", async () => {
            const transaction = await Lightrail.transactions.debit({
                id: uuid.v4().substring(0, 24),
                currency: "USD",
                uses: 2,
                source: {
                    rail: "lightrail",
                    valueId: valueId
                }
            });

            chai.assert.isNotNull(transaction);
            chai.assert.equal(transaction.body.transactionType, "debit");
        });
    });

    describe("reverse()", () => {
        it("successfully reverses a transaction", async () => {
            const creditTx = await Lightrail.transactions.credit({
                id: uuid.v4().substring(0, 24),
                currency: "USD",
                amount: 549,
                destination: {
                    rail: "lightrail",
                    valueId: valueId
                }
            });

            chai.assert.isNotNull(creditTx);
            chai.assert.equal(creditTx.body.transactionType, "credit");

            const reverseTx = await Lightrail.transactions.reverse(creditTx.body, {
                id: uuid.v4().substring(0, 24)
            });

            chai.assert.isNotNull(reverseTx);
            chai.assert.equal(reverseTx.body.transactionType, "reverse");
            chai.assert.equal((reverseTx.body.steps[0] as LightrailTransactionStep).balanceAfter, (creditTx.body.steps[0] as LightrailTransactionStep).balanceBefore);
            chai.assert.equal((reverseTx.body.steps[0] as LightrailTransactionStep).balanceBefore, (creditTx.body.steps[0] as LightrailTransactionStep).balanceAfter);
            chai.assert.equal((reverseTx.body.steps[0] as LightrailTransactionStep).balanceChange, -(creditTx.body.steps[0] as LightrailTransactionStep).balanceChange);
        });
    });

    describe("pendingVoid()", () => {
        it("successfully voids a pending transaction", async () => {
            const debitTx = await Lightrail.transactions.debit({
                id: uuid.v4().substring(0, 24),
                currency: "USD",
                amount: 100,
                source: {
                    rail: "lightrail",
                    valueId: valueId
                },
                pending: true
            });

            chai.assert.isNotNull(debitTx);
            chai.assert.equal(debitTx.body.transactionType, "debit");

            const voidTx = await Lightrail.transactions.voidPending(debitTx.body, {
                id: uuid.v4().substring(0, 24)
            });

            chai.assert.isNotNull(voidTx);
            chai.assert.equal(voidTx.body.transactionType, "void");
            chai.assert.equal((voidTx.body.steps[0] as LightrailTransactionStep).balanceAfter, (debitTx.body.steps[0] as LightrailTransactionStep).balanceBefore);
            chai.assert.equal((voidTx.body.steps[0] as LightrailTransactionStep).balanceBefore, (debitTx.body.steps[0] as LightrailTransactionStep).balanceAfter);
            chai.assert.equal((voidTx.body.steps[0] as LightrailTransactionStep).balanceChange, -(debitTx.body.steps[0] as LightrailTransactionStep).balanceChange);
        });
    });

    describe("pendingCapture()", () => {
        it("successfully captures a pending transaction", async () => {
            const debitTx = await Lightrail.transactions.debit({
                id: uuid.v4().substring(0, 24),
                currency: "USD",
                amount: 100,
                source: {
                    rail: "lightrail",
                    valueId: valueId
                },
                pending: true
            });

            chai.assert.isNotNull(debitTx);
            chai.assert.equal(debitTx.body.transactionType, "debit");

            const captureTx = await Lightrail.transactions.capturePending(debitTx.body, {
                id: uuid.v4().substring(0, 24)
            });

            chai.assert.isNotNull(captureTx);
            chai.assert.equal(captureTx.body.transactionType, "capture");
        });
    });

    describe("getTransactionChain", () => {
        it("successfully captures a pending transaction and fetches the chain", async () => {
            const debitTxId = uuid.v4().substring(0, 24);
            const captureTxId = uuid.v4().substring(0, 24);

            const debitTx = await Lightrail.transactions.debit({
                id: debitTxId,
                currency: "USD",
                amount: 100,
                source: {
                    rail: "lightrail",
                    valueId: valueId
                },
                pending: true
            });

            chai.assert.isNotNull(debitTx);
            chai.assert.equal(debitTx.body.transactionType, "debit");

            const captureTx = await Lightrail.transactions.capturePending(debitTx.body, {
                id: captureTxId
            });

            chai.assert.isNotNull(captureTx);
            chai.assert.equal(captureTx.body.transactionType, "capture");

            const transactionChain = await Lightrail.transactions.getTransactionChain(debitTxId);

            chai.assert.isNotNull(transactionChain);
            chai.assert.equal(transactionChain.body.length, 2);
            chai.assert.isNotNull(transactionChain.body.find(p => p.id === debitTxId));
            chai.assert.isNotNull(transactionChain.body.find(p => p.id === captureTxId));
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
