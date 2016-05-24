# Pull-requests
An overview of outstanding pull requests.

## Architecture

#### Server

* [Express](http://expressjs.com/)
* [Apollo server](http://docs.apollostack.com/apollo-server/tools.html) express middleware
* [github-oauth](https://www.npmjs.com/package/github-oauth)

#### Client

* [React](https://facebook.github.io/react/)
* [Redux](https://github.com/reactjs/redux)
* [Apollo client](http://docs.apollostack.com/apollo-client/)
* [Apollo redux integration](http://docs.apollostack.com/apollo-client/redux.html)

## Strategy

* Present the user with an invitation to login with Github.
* Login in via github-oauth and store the resulting token in the Apollo [connector](http://docs.apollostack.com/apollo-server/guide.html#Connectors).
* In the connector, use the supplied Github token to request the users' repos (https://developer.github.com/v3/repos/#list-your-repositories) and all open pull requests in parallel (possibly tranched) (https://developer.github.com/v3/pulls/#list-pull-requests) for owner specified in the resolver.
* Using Apollo's [GraphQL type language](http://docs.apollostack.com/apollo-server/generate-schema.html), create a GraphQLSchema to make data available to the client.
* On the client, import this data using (`mapQueriesToProps`)[http://docs.apollostack.com/apollo-client/react.html] and present an interface similar to this:
