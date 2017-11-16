import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {v4 as uuid} from "uuid";
import * as Lightrail from "./";
import * as contacts from "./contacts";
import * as cards from "./cards";
import {CreateAccountCardParams} from "./params/CreateAccountCardParams";
import {CreateTransactionParams} from "./params/CreateTransactionParams";
import {SimulateTransactionParams} from "./params/SimulateTransactionParams";

chai.use(chaiAsPromised);

const sampleContactId: string = process.env.CONTACT_ID;
const sampleShopperId: string = process.env.SHOPPER_ID;
const currency: string = "USD";

const accountCreationParams: CreateAccountCardParams = {
    currency: currency,
    cardType: "ACCOUNT_CARD",
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


describe("account methods", () => {
    before(() => {
        chai.assert.isString(process.env.LIGHTRAIL_API_KEY, "env var LIGHTRAIL_API_KEY must be set ot run the tests (for example set it in the .env file)");
        chai.assert.isString(process.env.CARD_ID, "env var CARD_ID must be set ot run the tests (for example set it in the .env file)");
        Lightrail.configure({
            apiKey: process.env.LIGHTRAIL_API_KEY || "",
        });
    });

    describe("createAccount", () => {
        it("creates an account - using contact id", async () => {
            const res = await contacts.accounts.createAccount({contactId: sampleContactId}, accountCreationParams);
            chai.assert.equal(res.contactId, sampleContactId);
        });
        it("creates an account - using shopperId", async () => {
            const res = await contacts.accounts.createAccount({shopperId: sampleShopperId}, accountCreationParams);
            console.log(res);
            const contact = await contacts.getContactById(res.contactId);
            chai.assert.equal(contact.userSuppliedId, sampleShopperId);
        });
    });
    describe("createTransaction", () => {
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
    });
    describe.only("simulateTransaction", () => {
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
            await chai.assert.isRejected(contacts.accounts.simulateTransaction({contactId: sampleContactId}, accountTransactionParamsHighValue));
        });
        it("throws error when simulating a transaction for too much value with nsf not set - using shopperId", async () => {
            accountTransactionParamsHighValue.userSuppliedId = uuid();
            await chai.assert.isRejected(contacts.accounts.simulateTransaction({shopperId: sampleShopperId}, accountTransactionParamsHighValue));
        });
    });
});