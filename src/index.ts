import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import {
  BookResolver,
  LibraryResolver,
  UserResolver,
} from "./graphql/resolvers";
import restapi from "./api/routes";
import scheduler from "./graphql/utils/scheduleReminder";

(async () => {
  const app = express();

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [BookResolver, LibraryResolver, UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.use(express.json());
  app.use("/api", restapi);

  await scheduler();
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`API server started on http://localhost:${port}/graphql`);
  });
})();
