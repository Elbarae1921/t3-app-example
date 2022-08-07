import { createRouter } from "./context";
import { z } from "zod";

const timeOutPromise = (milliseconds: number) => new Promise((res) => {
  setTimeout(res, milliseconds);
});

const todos = [
  { id: 1, title: "Todo 1", completed: false, date: "2020-01-01" },
  { id: 2, title: "Todo 2", completed: false, date: "2020-01-02" },
  { id: 3, title: "Todo 3", completed: false, date: "2020-01-03" },
  { id: 4, title: "Todo 4", completed: false, date: "2020-01-03" },
]

export const exampleRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    async resolve({ input }) {
      await timeOutPromise(3000);
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  })
  .query('getTodo', {
    input: z
      .object({
        id: z.number(),
        name: z.string(),
      }),
    async resolve({ input, ctx }) {
      return todos.find(todo => todo.id === input.id);
    }
  })
  .query('getAllTodos', {
    async resolve({ ctx }) {
      return todos;
    }
  })
  .mutation("createTodo", {
    input: z
      .object({
        title: z.string(),
        completed: z.boolean(),
        date: z.string(),
      }),
      async resolve({ input, ctx }) {
        const todo = {
          id: todos.length + 1,
          title: input.title,
          completed: input.completed,
          date: input.date,
          };
        todos.push(todo);
        return todo;
      }
  })
  .mutation('markTodoAsCompleted', {
    input: z
      .object({
        id: z.number()
      }),
    async resolve({ input, ctx }) {
      const todo = todos.find(todo => todo.id === input.id);
      if (todo) {
        todo.completed = true;
      }
      return todo;
    }
  });
