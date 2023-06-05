import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function userRoutes(app: FastifyInstance) {
  app.post("/user/register", async (request, response) => {
    const bodyshema = z.object({
      email: z.string().email(),
      name: z.string().min(3),
      password: z.string().min(8),
    });

    const { email, name, password } = bodyshema.parse(request.body);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    return user;
  });
}
