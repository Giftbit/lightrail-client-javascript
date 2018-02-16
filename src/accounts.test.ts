import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {v4 as uuid} from "uuid";
import * as Lightrail from "./";
import * as contacts from "./contacts";
import * as cards from "./cards";
import {CreateAccountCardParams, CreateTransactionParams, SimulateTransactionParams} from "./params";

chai.use(chaiAsPromised);

const sampleContactId: string = process.env.CONTACT_ID;
const sampleShopperId: string = process.env.SHOPPER_ID;
const currency: string = "USD";
const badCurrency: string = "AOA"; // any currency that your sample contact & sample shopper do not have accounts for

const accountCreationParams: CreateAccountCardParams = {
    currency: currency,
    userSuppliedId: uuid(),
};

const accountTransactionParams: CreateTransactionParams = {
    value: -1,
    currency: currency,
    userSuppliedId: "",  // must be regenerated in each test to avoid conflicts
};

const accountTransactionParamsHighValue: SimulateTransactionParams = {
    value: -10000000000000000,
    currency: currency,
    userSuppliedId: "",  // must be regenerated in each test to avoid conflicts
};

const accountTransactionParamsBadCurrency: CreateTransactionParams = {
    value: 1,
    currency: badCurrency,
    userSuppliedId: "does-not-matter-here",
};


describe("accounts", () => {
    before(() => {
        chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
        chai.assert.isString(process.env.CARD_ID, "env var CARD_ID must be set ot run the tests (for example set it in the .env file)");
        Lightrail.configure({
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });
    });

    describe("createAccount()", () => {
        it("creates an account - using contact id", async () => {
            const res = await contacts.accounts.createAccount({contactId: sampleContactId}, accountCreationParams);
            chai.assert.equal(res.contactId, sampleContactId);
        });
        it("creates an account - using shopperId", async () => {
            const res = await contacts.accounts.createAccount({shopperId: sampleShopperId}, accountCreationParams);
            const contact = await contacts.getContactById(res.contactId);
            chai.assert.equal(contact.userSuppliedId, sampleShopperId);
        });
        it("creates contact first if it doesn't exist", async () => {
            const newShopperId = uuid();
            const res = await contacts.accounts.createAccount({shopperId: newShopperId}, accountCreationParams);
            const contact = await contacts.getContactById(res.contactId);
            chai.assert.equal(contact.userSuppliedId, newShopperId);
        });
        it("throws error if contactId provided but can't find contact", async () => {
            await chai.assert.isRejected(contacts.accounts.createAccount({
                contactId: "does-not-exist",
                shopperId: "does-not-exist-either"
            }, accountCreationParams));
        });
    });
    describe("createTransaction()", () => {
        it("transacts against an account - using contact id", async () => {
            accountTransactionParams.userSuppliedId = uuid();
            const res = await contacts.accounts.createTransaction({contactId: sampleContactId}, accountTransactionParams);
            chai.assert.equal(res.userSuppliedId, accountTransactionParams.userSuppliedId);
        });
        it("transacts against an account - using shopperId", async () => {
            accountTransactionParams.userSuppliedId = uuid();
            const res = await contacts.accounts.createTransaction({shopperId: sampleShopperId}, accountTransactionParams);
            const accountCard = await cards.getCardById(res.cardId);
            const contact = await contacts.getContactById(accountCard.contactId);
            chai.assert.equal(contact.userSuppliedId, sampleShopperId);
        });
        it("throws an error if account card not found", async () => {
            await chai.assert.isRejected(contacts.accounts.createTransaction({shopperId: sampleShopperId}, accountTransactionParamsBadCurrency));
        });
    });
    describe("simulateTransaction()", () => {
        it("simulates transacting against an account - using contact id", async () => {
            accountTransactionParams.userSuppliedId = uuid();
            const res = await contacts.accounts.simulateTransaction({contactId: sampleContactId}, accountTransactionParams);
            chai.assert.equal(res.userSuppliedId, accountTransactionParams.userSuppliedId);
        });
        it("simulates transacting against an account - using shopperId", async () => {
            accountTransactionParams.userSuppliedId = uuid();
            const res = await contacts.accounts.simulateTransaction({shopperId: sampleShopperId}, accountTransactionParams);
            const accountCard = await cards.getCardById(res.cardId);
            const contact = await contacts.getContactById(accountCard.contactId);
            chai.assert.equal(contact.userSuppliedId, sampleShopperId);
        });

        it("simulates transacting against an account - using contact id - nsf: false", async () => {
            accountTransactionParamsHighValue.userSuppliedId = uuid();
            accountTransactionParamsHighValue.nsf = false;
            const res = await contacts.accounts.simulateTransaction({contactId: sampleContactId}, accountTransactionParamsHighValue);
            chai.assert.equal(res.userSuppliedId, accountTransactionParamsHighValue.userSuppliedId);
        });
        it("simulates transacting against an account - using shopperId - nsf: false", async () => {
            accountTransactionParamsHighValue.userSuppliedId = uuid();
            accountTransactionParamsHighValue.nsf = false;
            const res = await contacts.accounts.simulateTransaction({shopperId: sampleShopperId}, accountTransactionParamsHighValue);
            const accountCard = await cards.getCardById(res.cardId);
            const contact = await contacts.getContactById(accountCard.contactId);
            chai.assert.equal(contact.userSuppliedId, sampleShopperId);
        });
        it("throws error when simulating a transaction for too much value with nsf not set - using contact id", async () => {
            accountTransactionParamsHighValue.userSuppliedId = uuid();
            accountTransactionParamsHighValue.nsf = true;
            await chai.assert.isRejected(contacts.accounts.simulateTransaction({contactId: sampleContactId}, accountTransactionParamsHighValue));
        });
        it("throws error when simulating a transaction for too much value with nsf not set - using shopperId", async () => {
            accountTransactionParamsHighValue.userSuppliedId = uuid();
            accountTransactionParamsHighValue.nsf = true;
            await chai.assert.isRejected(contacts.accounts.simulateTransaction({shopperId: sampleShopperId}, accountTransactionParamsHighValue));
        });
    });
});
