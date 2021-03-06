# Lightrail Client for JavaScript and TypeScript

Lightrail is a modern platform for digital account credits, gift cards, promotions, and points (to learn more, visit [Lightrail](https://www.lightrail.com/)). This is a basic library for developers to easily connect with the Lightrail API using Javascript or Typescript.  You can find JS API documentation at https://giftbit.github.io/lightrail-client-javascript/ .

This client runs on your server and makes calls to the Lightrail server.

## Features

The following features are supported in this version:

[Contacts](https://giftbit.github.io/lightrail-client-javascript/modules/_contacts_.html): Create, Get, List, Update, Delete, List Values, Attach to Value, Detach from Value
 
[Values](https://giftbit.github.io/lightrail-client-javascript/modules/_values_.html): Create, Get by Id, Get by FullCode, List, Update, Delete
  
[Programs](https://giftbit.github.io/lightrail-client-javascript/modules/_programs_.html): Create, Get, List, Update, Delete, Create Issuance, Get Issuance, List Issuances

[Transactions](https://giftbit.github.io/lightrail-client-javascript/modules/_transactions_.html): Checkout, Debit, Credit, Transfer, Reverse, Capture Pending, Void Pending, Get, Get Transaction Chain, List
  
[Currencies](https://giftbit.github.io/lightrail-client-javascript/modules/_currencies_.html): Create, Get, List, Update, Delete

[Webhooks](https://giftbit.github.io/lightrail-client-javascript/modules/_webhooks_.html): Create, Get, List, Update, Delete, Create Secret, Get Secret, Delete Secret

For a complete list of Lightrail API features check out the [Lightrail API documentation](https://apidocs.lightrail.com/).

## Usage

### Configuration

Before using this client, you'll need to [configure](https://giftbit.github.io/lightrail-client-javascript/modules/_index_.html#configure) it to use your API key:

```javascript
import * as Lightrail from "lightrail-client";
// or
const Lightrail = require('lightrail-client');

Lightrail.configure({
  apiKey: '<LIGHTRAIL API KEY>'
})
```

The API key you configure should not be shared publicly. Also, it should not be set in the browser or any client side code because it can be viewed and tampered with. The browser cannot be trusted to interact with the Lightrail API directly.

### Compiling for node with webpack

This library uses superagent to facilitate network requests.  To have webpack use the node-version of superagent your webpack config must include `target: 'node'`.

If when running your code you see the error `TypeError: undefined is not a function` then most likely you must include the following in the plugins section of your webpack config: `plugins: [new webpack.DefinePlugin({"global.GENTLY": false})]`.  See https://github.com/felixge/node-formidable/issues/337 for an explanation.

## Development

### Testing

Testing requires a Lightrail account.  Copy `.env.example` to `.env` and set your account's test API key which is available in the Lightrail web app.

Then you can run `npm test`.

### Contributing

Bug reports and pull requests are welcome on GitHub at <https://github.com/Giftbit/lightrail-client-javascript>.

### Releasing (Lightrail team only)

1. Update the version of the project in `package.json` following [semantic versioning](https://docs.npmjs.com/about-semantic-versioning).
2. Publish to npm with the command `npm publish`.  Tests and linting run as part of this script.
3. [Create a GitHub release](https://help.github.com/en/articles/creating-releases).   The release name and tag must be `v` followed by the version number (eg: `v1.2.3`).    The description must list changes and highlight any breaking changes.

## License

This library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
