const { ApolloServer, PubSub } = require('apollo-server');
const gql = require('graphql-tag');
const pubSub = new PubSub()
const NEW_ITEM = 'NEW_ITEM'

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: Int!
  }

  type Settings {
    user: User!
    theme: String!
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

  type Subscription {
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
  context({ connection }) {
    if (connection) return { ...connection.context }
  },
  subscriptions: {
    onConnect(params) {

    }
  }
});

server.listen().then(({ url }) => console.log(`Server on ${url}`));
