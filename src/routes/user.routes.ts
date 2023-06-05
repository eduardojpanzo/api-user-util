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

  app.get("/users/:email", async (request, response) => {
    const paramsSchema = z.object({
      email: string().email(),
    });

    const { email } = paramsSchema.parse(request.params);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
      select: {
        name: true,
        id: true,
      },
    });

    if (!user) {
      return response.status(401).send();
    }

    return user;
  });
}
