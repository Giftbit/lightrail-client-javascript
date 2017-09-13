# lightrail-client-javascript

Lightrail is a modern platform for digital account credits, gift cards, promotions, and points (to learn more, visit [Lightrail](https://www.lightrail.com/)). Lightrail Client Library is a basic library for developers to easily connect with the Lightrail API using Javascript or Typescript. If you are looking for specific use cases or other languages, check out the complete list of all [Lightrail libraries and integrations](https://github.com/Giftbit/Lightrail-API-Docs/blob/master/README.md#lightrail-integrations).

## Important

This client is currently in *beta* and may have breaking changes before 1.0.0.

## Compiling for node with webpack

This library uses superagent to make network requests.  To have webpack use the node-version your webpack config must include `target: 'node'`.

If when running your code you see the error `TypeError: undefined is not a function` then you must include the following in the plugins section of your webpack config: `plugins: [new webpack.DefinePlugin({"global.GENTLY": false})]`.  See https://github.com/felixge/node-formidable/issues/337 for an explanation.
