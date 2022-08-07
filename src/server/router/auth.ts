import { createRouter } from "./context";
import { z } from "zod";
import { loginSchema, signUpSchema } from "../validation/auth";
import * as trpc from '@trpc/server';
import argon from "argon2";
import jwt from 'jsonwebtoken';

type User = {
  email: string;
  username: string;
  password: string;
}

const users: User[] = [];

export const authRouter = createRouter()
  .query('me', {
    async resolve({ ctx }) {
      const { user } = ctx;
      return user;
    }
  })
  .mutation("signup", {
    input: signUpSchema,
      async resolve({ input, ctx }) {
        const { email, password, username } = input;

        const exists = await ctx.prisma.user.findFirst({
          where: {
            email
          }
        });

        if (exists) {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "User already exists",
          })
        }

        const hashedPassword = await argon.hash(password);

        const user = await ctx.prisma.user.create({
          data: {
            email,
            username,
            password: hashedPassword,
          },
        });

        return {
          status: 201,
          message: "User created successfully",
          data: jwt.sign({ email: user.email }, 'secret'),
        };
      }
  })
  .mutation("login", {
    input: loginSchema,
    async resolve({ input, ctx }) {
      const { email, password } = input;

      const user = await ctx.prisma.user.findFirst({
        where: {
          email
        }
      });

      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      const isValid = await argon.verify(user.password, password);

      if (!isValid) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        })
      }

      return {
        status: 200,
        message: "Login successful",
        data: jwt.sign({ email: user.email }, 'secret'),
      };
    }
  });
