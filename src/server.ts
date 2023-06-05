import fastify from "fastify";

import { userRoutes } from "./routes/user.routes";

const app = fastify();

app.register(userRoutes);

app.listen({ port: 3003 }).then(() => {
  console.log("rodando na porta 3003");
});
