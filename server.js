const { ApolloServer, PubSub, SchemaDirectiveVisitor } = require('apollo-server');
const gql = require('graphql-tag');
const { defaultFieldResolver, GraphQLString } = require('graphql')
const pubSub = new PubSub()
const NEW_ITEM = 'NEW_ITEM'

class LogDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver

    // Using arguments in directive
    field.args.push({
      type: GraphQLString,
      name: 'message'
    })
    field.resolve = (root, { message, ...rest }, ctx, info) => {
      // field.resolve = (args) => {
      const { message: schemaMessage } = this.args
      console.log('custom directive - ', message || schemaMessage);
      return resolver.call(this, root, rest, ctx, info)
    }
  }
}

const typeDefs = gql`
  directive @log(message: String = "default message") on FIELD_DEFINITION

  type User {
    id: ID! @log
    username: String!
    createdAt: Int!
  }

  type Settings {
    user: User!
    theme: String!
  }

  type Subscription {
    newItem: Item!
  }

  type Item {
    task: String!
  }

  input NewSettingsInput {
    user: ID!
    theme: String!
  }

  type Query {
    me: User!
    settings(user: ID!): Settings!
  }

  type Mutation {
    updateSettings(input: NewSettingsInput!): Settings!
    createItem(task: String!): Item
  }

  type SignupInput {
    newItem: Item
  }
`;

const items = []
const resolvers = {
  Query: {
    me: () => {
      return {
        id: '1',
        username: 'logger1',
        createdAt: 532726754,
      };
    },
    settings: (_, { user }) => {
      return {
        user,
        theme: 'Dark',
      };
    },
  },

  Mutation: {
    updateSettings: (_, { input }) => {
      return input;
    },
    createItem(_, { task }) {
      const item = { task }
      pubSub.publish(NEW_ITEM, { newItem: item })
      return item
    }
  },

  Subscription: {
    newItem: {
      subscribe: () => pubSub.asyncIterator(NEW_ITEM)
    }
  },

  Settings: {
    user: () => {
      return {
        id: '1',
        username: 'logger1',
        createdAt: 532726754,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    log: LogDirective
  },
  context({ connection }) {
    if (connection) return { ...connection.context }
  },
  subscriptions: {
    onConnect(params) {

    }
  }
});

server.listen().then(({ url }) => console.log(`Server on ${url}`));
