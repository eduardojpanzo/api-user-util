import { FastifyInstance } from "fastify";
import { string, z } from "zod";
import { prisma } from "../lib/prisma";

export async function userRoutes(app: FastifyInstance) {
  app.post("/user/register", async (request, response) => {
    const bodyshema = z.object({
      email: z.string().email(),
      name: z.string().min(3),
      password: z.string().min(8),
    });

    const data = bodyshema.parse(request.body);

    const user = await prisma.user.create({
      data: {
        ...data,
      },
    });

    return user;
  });

  app.get("/users", async (request, response) => {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        id: true,
      },
    });

    return users;
  });

  app.get("/user/:email", async (request, response) => {
    const paramsSchema = z.object({
      email: string().email(),
    });

    const { email } = paramsSchema.parse(request.params);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!user) {
      return response.status(404).send();
    }

    return user;
  });

  app.post("/user/login", async (request, response) => {
    const bodyshema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    const { email, password } = bodyshema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return response.status(404).send({ msg: "Email or Password is Wrong!" });
    }

    if (user.password !== password) {
      return response.status(404).send({ msg: "Email or Password is Wrong!" });
    }

    const token = app.jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      {
        sub: user.id,
        expiresIn: "3 days",
      }
    );

    return { token };
  });
}
