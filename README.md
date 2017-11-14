# lightrail-client-javascript

Lightrail is a modern platform for digital account credits, gift cards, promotions, and points (to learn more, visit [Lightrail](https://www.lightrail.com/)). Lightrail Client Library is a basic library for developers to easily connect with the Lightrail API using Javascript or Typescript. If you are looking for specific use cases or other languages, check out the complete list of all [Lightrail libraries and integrations](https://github.com/Giftbit/Lightrail-API-Docs/blob/master/README.md#lightrail-integrations).

## Important

This client is currently in *beta* and may have breaking changes before 1.0.0.

## Compiling for node with webpack

This library uses superagent to facilitate network requests.  To have webpack use the node-version of superagent your webpack config must include `target: 'node'`.

If when running your code you see the error `TypeError: undefined is not a function` then most likely you must include the following in the plugins section of your webpack config: `plugins: [new webpack.DefinePlugin({"global.GENTLY": false})]`.  See https://github.com/felixge/node-formidable/issues/337 for an explanation.

# Use Case: Account Credits Powered by Lightrail

## Introduction

This is a quick step-by-step guide to implementing account credits powered by Lightrail via the Javascript client. The focus will be on implementing this use case by using library methods to call the Lightrail API.

If you are looking for an implementation of account credits in a different language or technology, check out the section on Client Libraries and Integrations in the [Lightrail API Docs](https://www.lightrail.com/docs/).

## Concepts

Many business use-cases such as rewards programs require tracking values attached to a customer in the form of an account. This could be in the form of real currency values or virtual values such as points. Lightrail supports this by introducing two interconnected concepts:

- **Contact** which represents a customer to whom the values are associated.
- **Account Card** which represents an account, in a specific currency, which belongs to a specific Contact.

Cards provide a vehicle for implementing an account. Account creation, balance-checking, and transacting against a customer account is, therefore, simply done by interacting with the Card. By associating different account Cards to a Contact, multiple accounts can be assigned to a given customer.

Each Account Card has a fixed currency which is specified at the time of its creation. Since Lightrail does not support currency exchange, different currency values should each be stored in a separate Account Card. Therefore, a Contact may have many Account Cards for different currencies —but no more than one account Card per currency.

For example, a Contact may have one account for `USD` and another for `CAD` values, as well as a points account (for which the standard currency symbol is `XXX`) to track reward points. Each of these accounts is represented by an Account Card associated with that Contact.


## Use-Cases

In this section we review the overall steps for common account credit use-cases. Details for each API endpoint and request/response examples are given in the next section.

### Configuration

Before using this client, you'll need to configure it to use your API key:

```javascript
const Lightrail = require('lightrail');

Lightrail.configure({
  apiKey: <LIGHTRAIL API KEY>,
  restRoot: 'https://api.lightrail.com/v1/'
})
```

### Balance-Check

For checking the balance of an account you can call the [Transaction Simulation and Balance method](#transaction-simulation-and-balance-endpoint); you need to provide the `cardId` of the Account Card.

### Creating Account Credits

The first step to initialize account credit is to create a new account. Based on your business workflows this is triggered by events such as signing up a new customer. After determining the currency for the new account, proceed with the following steps:

- Create a new Contact using the [contact creation method](#creating-a-new-contact) if one does not already exist. Generally, you should specify some basic information about the Contact such as name and email.
- Create an Account Card for that Contact using the [account creation](#creating-a-new-account-card) method. You need to provide the contact ID and specify the currency. Optionally, you can also specify an initial value for the card.

We recommend that you persist the Contact ID in your system so that you can find the Lightrail Contact corresponding to your customer easily. Alternatively, you can search for a Contact based on the `userSuppliedId` as will be discussed later. You do not need to persist the Account Cards IDs of a Contact since you can retrieve them by calling the API. Persisting these IDs, however, can help you avoid making that additional API call.

### Retrieving a Contact's Account Cards

In most business workflows, you usually have access to the customer ID (e.g. from login information). If you persist the Contact ID in your database as, or alongside, the customer ID, you can easily retrieve the Card IDs for the customer in question by providing the Contact ID using the methods for [Handling Cards](#handling-cards).  If your system supports multiple currencies, you also need to identify the effective currency of your workflow and pass it as an additional parameter to the Card Search endpoint in order to uniquely retrieve the Account Card for that particular currency.

### Funding and Charging

Transactions to fund or charge an account are posted to the corresponding Account Card by providing its Card ID and using the [Card Transaction methods](#card-transaction-methods). If you do not have the Account Card ID directly in your workflow, you need to retrieve it using the library methods based on the Contact ID as discussed above.

To fund an account, post a Transaction with a positive value to the corresponding Account Card. Depending on your business model, this usually takes place when the customer earns some reward based on some activity. To charge an account, post a Transaction against the corresponding Account Card with a negative value. The most common use-case for charging an account is redeeming the value at the store checkout. For the details on the redemption use-case, check out our detailed document on [Redemption at Checkout](https://github.com/Giftbit/Lightrail-API-Docs/blob/master/use-cases/giftcode-checkout.md).

## API Calls

### Handling Contacts

#### Creating a New Contact

To create a new Contact, you need to provide a client-side unique identifier known as the `userSuppliedId`. The `userSuppliedId` is a per-endpoint unique identifier used to ensure idempotence. Ensuring idempotence means that if the same request is issued more than once, it will not result in repeated actions. Optionally, you can also provide an `email`, `firstName`, and `lastName`. Here is a sample request:

```javascript
const Lightrail = require('lightrail');

const newContactParams = {
  userSuppliedId: 'customer-9f50629d',
  email: 'test@test.ca',
  firstName: 'Test',
  lastName: 'McTest'
};
Lightrail.createContact(newContactParams).then(
  // called asynchronously
);
```

Sample response:

```json
{
  "contactId": "contact-271a",
  "userSuppliedId": "customer-9f50629d",
  "email": "test@test.ca",
  "firstName": "Test",
  "lastName": "McTest",
  "dateCreated": "2017-07-26T23:50:04.000Z"
}
```

The response objects will include both the `userSuppliedId` and a server-generated `contactId` which you can persist and use to retrieve the Contact later.

#### Retrieving a Contact

You can retrieve a Contact based on its `contactId`. The response to this call will be a `contact` object similar to the one shown above.

```javascript
Lightrail.contacts.getContactById('contact-271a').then(
  // called asynchronously
);
```

Alternatively, you can retrieve a contact based on its `userSuppliedId`:

```javascript
Lightrail.contacts.getContactByUserSuppliedId('customer-9f50629d').then(
  // called asynchronously
);
```

### Handling Cards

#### Creating a New Account Card

For creating a new Account Card, you need to provide the `contactId` of the Contact with whom the card will be associated and specify the card `currency`. Note that since gift cards use the same endpoint, you have to also specify the `cardType` as  `ACCOUNT_CARD`.

You also need to provide a`userSuppliedId`, a unique identifier from your own system. Since each Contact can have only up to one Account Card per currency, you can add the currency as a suffix to the `userSupliedId` you provided for the Contact.

```javascript
const newAccountParams = {
  userSuppliedId: 'customer-9f50629d-USD';
  cardType: 'ACCOUNT_CARD';
  currency: 'USD';
  initialValue: 500;
  contactId: 'contact-271a';
};
Lightrail.cards.createCard(newAccountParams).then(
  // called asynchronously
);
```

The response object will include both the `userSuppliedId` and a server-generated `cardId` which you can persist and use to retrieve the Account Card later.

```json
{
  "cardId": "card-1dxxea",
  "userSuppliedId": "customer-9f50629d-USD",
  "contactId": "contact-271a",
  "dateCreated": "2017-07-26T23:50:04.572Z",
  "cardType": "ACCOUNT_CARD",
  "currency": "USD",
  "categories":[
    {
      "categoryId": "category-bdxx88",
      "key": "giftbit_order",
      "value": "2017-07-26"
    },
    {
      "categoryId": "category-95xxc2",
      "key": "giftbit_program",
      "value": "program-account-USD-user-088e"
    }
  ]
}
```

#### Retrieving a Contact's Cards

You can retrieve all the Account Cards belonging to a Contact, filtering by contact ID, currency, and/or `userSuppliedId`. Because Gift Cards can also be associated with a Contact, you must also specify the `cardType` as  `ACCOUNT_CARD`:

```javascript
const accountSearchCriteria = {
  cardType: 'ACCOUNT_CARD',
  contactId: 'contact-271a',   // or use the contact's userSuppliedId
  currency: 'USD'    // optional: leave this off to get all of a Contact's Account Cards
};
Lightrail.cards.getCards(accountSearchCriteria).then(
  // called asynchronously
);
```

You can also optionally specify pagination parameters by including a `limit` and `offset`. Note that if you include the `currency`, you will be guaranteed to get at most one `card` object back in the results since there can only be one card per currency per contact.

The response is in the form of search results which includes an array of `card` objects similar to the following:

```json
{
 "cards":[
  {
    "cardId": "card-1dxxea",
    "userSuppliedId": "customer-9f50629d-USD",
    "contactId": "contact-271a",
    "dateCreated": "2017-07-26T23:50:04.572Z",
    "cardType": "ACCOUNT_CARD",
    "currency": "USD",
    "categories":[
     {
      "categoryId": "category-bdxx88",
      "key": "giftbit_order",
      "value": "2017-07-26"
     },
     {
      "categoryId": "category-95xxc2",
      "key": "giftbit_program",
      "value": "program-account-USD-user-088e"
     }
    ]
  }
 ],
 "pagination":{
   "count": 1,
   "limit": 100,
   "maxLimit": 1000,
   "offset": 0,
   "totalCount": 1
 }
}
```

### Transaction Simulation and Balance Checking

This method allows you to do a test-run for a Transaction by providing a request (including full `metadata` if you are using Redemption Rules). In the case of insufficient funds, it can also tell you the maximum value for which the Transaction _would be_ successful. For example, if you simulate a $35 drawdown Transaction, the method can tell you that it _would be_ successful if it were only for $20. This provides a mechanism to check the available value of a Card for a particular Transaction context.

For this method, you will need to provide the Card's `cardId`. For Account Cards, if you do not have the `cardId` you can retrieve it based on the customer's `contactId` using the [Card Search method](#retrieving-a-contacts-cards), as discussed above.

You also need to provide the following:

- The Transaction `value` you would like to drawdown.
- The Transaction `currency`.
- A `userSuppliedId` as an idempotency key. Note that since this is a simulation, if a Transaction with this `userSuppliedId` already exists, Lightrail will retrieve that.
- The attribute `nsf` set to `false`. This tells Lightrail to return a best-effort would-be Transaction instead of a not-sufficient-funds (NSF) error, if the Card's available value is not enough for the suggested Transaction value.

Request Sample:

```javascript
const cardId = 'card-1dxxea';
const simulationParams = {
  userSuppliedId:"order-s3xx30",
  value:-6960,
  currency:"USD",
  nsf: false,
  metadata: {
    cart: {
      total: 6960,
      items: [
        {
          id: "B009L1MF7A",
          quantity: 3,
          unit_price: 2320,
          tags: ["apparel", "outdoor"]
        }
      ]
    }
  }
};

Lightrail.cards.transactions.simulateTransaction(cardId, simulationParams).then(
  // called asynchronously
);
```

The response will be similar to the following. Note that this is just a simulation and NOT an actual Transaction; for instance, it does not have a `transactionId`. The response indicates that for this Transaction, the maximum value this Card can provide is $55. In other words, if you attempt to create a drawdown Transaction for up to $55, it will be successful.

More details about the promotions that are unlocked for this Transaction are provided in the `transactionBreakdown`. You can use this information to display all the unlocked promotions for this order.  Check out the [Lightrail Redemption Rules Implementation Guide](https://github.com/Giftbit/Lightrail-API-Docs/blob/master/use-cases/redemption-rules.md) for further discussion of this object.

```javascript
{
  "value":-5500,
  "userSuppliedId":"order-s3xx30",
  "dateCreated":null,
  "transactionType":"DRAWDOWN",
  "transactionAccessMethod":"CARDID",
  "valueAvailableAfterTransaction":0,
  "cardId":"card-dcxx37",
  "currency":"USD",
  "transactionBreakdown":[
    {
      "value":-500,
      "valueAvailableAfterTransaction":0,
      "valueStoreId":"value-02xx6c"
    },
    {
      "value":-5000,
      "valueAvailableAfterTransaction":0,
      "valueStoreId":"value-66xxf2"
    }
  ],
  "transactionId":null,
  "metadata":{
    "cart":{
      "total":6960,
      "items":[
        {
          "quantity":3,
          "id":"B009L1MF7A",
          "unit_price":2320,
          "tags":["apparel","outdoor"]
        }
      ]
    }
  },
  "codeLastFour":"YNJC"
}
```

### Card Transaction Methods

You can transact against an Account Card by providing the corresponding `cardId`, the transaction `value`, and its `currency`, as well as a `userSuppliedId`. The `userSuppliedId` is a per-endpoint unique identifier, used to ensure idempotence. Ensuring idempotence means that if the same request is issued more than once, it will not result in repeated actions.

If you do not have the `cardId` you can retrieve it based on the customer's `contactId`, as discussed above.

```javascript
const transactionParams = {
  cardId: 'card-1dea',
  value: 120,
  currency: 'USD',
  usersuppliedId: 'tx-fe2d'
};
Lightrail.cards.transactions.createTransaction(transactionParams).then(
  // called asynchronously
);
```

The returned object includes both the `userSuppliedId` and a server-generated `transactionId` which you can use later to retrieve this transaction.

```json
{
  "transactionId": "transaction-fec7",
  "value": 120,
  "userSuppliedId": "tx-fe2d",
  "dateCreated": "2017-07-27T23:51:12.228Z",
  "transactionType": "FUND",
  "transactionAccessMethod": "CARDID",
  "cardId": "card-1dea",
  "currency": "USD"
}
```

#### Authorize-Capture

For drawdown transactions, Lightrail supports the authorize-capture flow. By setting the value of the `pending` attribute, you can tell Lightrail to create a pending Transaction. The funds for a pending Transaction are withheld until it is _captured_ or _voided_ later:

```javascript
const pendingTransactionParams = {
  cardId: 'card-1dea',
  value: -101,
  currency: 'USD',
  usersuppliedId: 'tx-1eea45t',
  pending: true
};
Lightrail.cards.transactions.createTransaction(pendingTransactionParams).then(
  // called asynchronously
);
```

From the response to this call, you need to save the `cardId` and the `transactionId` of the pending Transaction which you will need later, in order to `void` or `capture` it by calling one of the following methods. You must also pass in a `userSuppliedId` to guarantee idempotence, and you may optionally pass in metadata as well.

```javascript
const voidTransactionParams = {
  userSuppliedId:"tx0771",
  metadata: {
    //...
  }
}
Lightrail.cards.transactions.voidPending('card-1dea', 'transaction-fec7', voidTransactionParams).then(
  // called asynchronously
);
```

```javascript
const capturedTransactionParams = {
  userSuppliedId:"tx0771",
  metadata: {
    //...
  }
}
Lightrail.cards.transactions.capturePending('card-1dea', 'transaction-fec7', capturedTransactionParams).then(
  // called asynchronously
):
```

The response object from these calls will be a new Transaction object with a new `transactionId`. For reference, the ID of the original pending transaction is also included as `parentTransactionId` in the response object to these calls:

```json
{
      "transactionId": "transaction-axx7",
      "value": 101,
      "userSuppliedId": "tx0771",
      "dateCreated": "2017-07-12T00:22:48.379Z",
      "transactionType": "PENDING_VOID",
      "transactionAccessMethod": "CARDID",
      "cardId": "card-1dea",
      "currency": "USD",
      "parentTransactionId": "transaction-4xx6",
      "metadata": {
          "giftbit_initial_transaction_id": "transaction-46"
      }
}
```
