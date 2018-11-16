// Sample application using Facebook GraphQL
// Link: https://appdividend.com/2018/04/02/graphql-tutorial-for-beginners/
//       https://graphqlmastery.com/blog/graphql-list-how-to-use-arrays-in-graphql-schema

const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql');
const schema = require('./schema');

app.use('/graphql', expressGraphQL({
	schema: schema,
	rootValue: global,
    graphiql: true
}));

app.listen(4000, () => {
	console.log('Server is running');
});