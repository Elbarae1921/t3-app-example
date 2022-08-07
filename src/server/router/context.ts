// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { decodeAuthHeader } from "../../utils/decodeAuthHeader";
import { prisma } from "../db/client";

export const createContext = (opts?: trpcNext.CreateNextContextOptions) => {
  const req = opts?.req;
  const res = opts?.res;

  const getUser = () => {
    if (req?.headers.authorization) {
      return decodeAuthHeader(req.headers.authorization);
    }
    return null;
  }

  const user = getUser();
  

  return {
    req,
    res,
    prisma,
    user
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
