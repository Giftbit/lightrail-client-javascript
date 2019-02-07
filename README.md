# Lightrail Client for JavaScript and TypeScript

Lightrail is a modern platform for digital account credits, gift cards, promotions, and points (to learn more, visit [Lightrail](https://www.lightrail.com/)). This is a basic library for developers to easily connect with the Lightrail API using Javascript or Typescript. If you are looking for specific use cases or other languages, check out the complete list of all [Lightrail libraries and integrations](https://github.com/Giftbit/Lightrail-API-Docs/blob/master/README.md#lightrail-integrations).

## Features

The following features are supported in this version:

##### Contacts
Create, Get, List, Update, Delete, List Values, Attach Value
 
##### Values
Create, Get by Id, Get by FullCode, List, Update, Delete
  
##### Programs
Create, Get, List, Update, Delete, Create Issuance, Get Issuance, List Issuances

##### Transactions
Checkout, Debit, Credit, Transfer, Reverse, Capture Pending, Void Pending, Get, List
  
##### Currencies
Create, Get, List, Update, Delete

Note that the Lightrail API supports many other features and we are still working on covering them in this library. For a complete list of Lightrail API features check out the [Lightrail API documentation](https://www.lightrail.com/docs/).

## Usage

### Configuration

Before using this client, you'll need to configure it to use your API key:

```javascript
const Lightrail = require('lightrail');

Lightrail.configure({
  apiKey: '<LIGHTRAIL API KEY>'
})
```

### Compiling for node with webpack

This library uses superagent to facilitate network requests.  To have webpack use the node-version of superagent your webpack config must include `target: 'node'`.

If when running your code you see the error `TypeError: undefined is not a function` then most likely you must include the following in the plugins section of your webpack config: `plugins: [new webpack.DefinePlugin({"global.GENTLY": false})]`.  See https://github.com/felixge/node-formidable/issues/337 for an explanation.

## Development

### Testing

Testing requires a Lightrail account.  Copy `.env.example` to `.env` and set your account's test API key which is available in the Lightrail web app.

Then you can run `npm test`.

### Contributing

Bug reports and pull requests are welcome on GitHub at <https://github.com/Giftbit/lightrail-client-javascript>.

## License

This library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
