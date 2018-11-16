// Sample application using Facebook GraphQLObjectType
// Link: https://www.npmjs.com/package/graphql
//       https://appdividend.com/2018/04/02/graphql-tutorial-for-beginners/

const { graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
  } = require('graphql');

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      greeting: {
        type: GraphQLString,
        resolve() {
          return 'Hello World!';
        }
      }
    }
  })
});

graphql(schema, '{ greeting }').then(result => {
 
  // Prints
  // {
  //   data: { greeting: "Hello world!" }
  // }
  console.log(result);
 
});