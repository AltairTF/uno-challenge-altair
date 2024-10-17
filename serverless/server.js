const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { TODO_LIST } = require('./makeData');

/**
 * Gera um número inteiro para utilizar de id
 */
function getRandomInt() {
  return Math.floor(Math.random() * 999);
}

const typeDefs = `#graphql
  type Item {
    id: Int
    name: String
  }

  input ItemInput {
    id: Int
    name: String
  }

  input ItemFilter {
    id: Int
    name: String
  }

  type Query {
    todoList(filter: ItemFilter): [Item]
  }

  type Mutation {
    addItem(values: ItemInput): Boolean
    updateItem(values: ItemInput): Boolean
    deleteItem(id: Int!): Boolean
  }
`;

const resolvers = {
  Query: {
    todoList: (_, { filter }) => {
      if (!filter) {
        return TODO_LIST;
      }

      const { id, name } = filter;

      // Filtro da lista sobre o nome e o id
      return TODO_LIST.filter(item => {
        let matches = true;

        if (id !== undefined && item.id !== id) {
          matches = false;
        }

        if (name !== undefined && !item.name.toLowerCase().includes(name.toLowerCase())) {
          matches = false;
        }

        return matches;
      });
    },
  },
  Mutation: {
    addItem: (_, { values: { name } }) => {
      // Busca se existe uma tarefa com o mesmo nome
      const existingItem = TODO_LIST.find(item => item.name.toLowerCase() === name.toLowerCase());

      // Retorna um erro se existir uma tarefa com o mesmo nome
      if (existingItem) {
        throw new Error(`Uma tarefa com o nome "${name}" já existe.`);
      }

      TODO_LIST.push({
        id: getRandomInt(),
        name,
      });

      return true;
    },
    updateItem: (_, { values: { id, name } }) => {
      // Busca a tarefa por id
      const itemIndex = TODO_LIST.findIndex(item => item.id === id);

      // Retorna um erro se o id nao existir
      if (itemIndex === -1) {
        throw new Error(`Item com id ${id} não encontrado.`);
      }

      // Busca se existe uma tarefa com o mesmo nome
      const existingItem = TODO_LIST.find(item => item.name.toLowerCase() === name.toLowerCase() && item.id !== id);

      // Retorna um erro se existir uma tarefa com o mesmo nome
      if (existingItem) {
        throw new Error(`Uma tarefa com o nome "${name}" já existe.`);
      }

      TODO_LIST[itemIndex].name = name;

      return true;
    },
    deleteItem: (_, { id }) => {
      // Busca a tarefa por id
      const itemIndex = TODO_LIST.findIndex(item => item.id === id);

      // Retorna um erro se o id nao existir
      if (itemIndex === -1) {
        throw new Error(`Item com id ${id} não encontrado.`);
      }

      TODO_LIST.splice(itemIndex, 1);

      return true;
    },
  },
};

// Configuração para subir o backend
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

startServer();
