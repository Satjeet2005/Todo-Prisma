import { prisma } from "../config/prisma.ts";
import type { Todo } from "../models/todo.model.ts";
import { APIError } from "../utility/Error.ts";
import logger from "../utility/logger.ts";
import client from "../utility/Redis.ts";
import { convertURLToRedisKey, scanAndDeleteKey } from "../utility/utils.ts";

const VALID_SEARCH_QUERY = ["title", "description"];
export const createTodoService = async (
  baseUrl: string,
  body: Omit<Todo, "id">,
) => {
  const { title, description } = body;

  if (!title)
    throw new APIError({
      status: 400,
      message: "Title is required to create the Todo",
      success: false,
    });

  if (!description)
    throw new APIError({
      status: 400,
      message: "Description is required to create the Todo",
      success: false,
    });

  const todo = await prisma.todo.create({
    data: {
      title: title.trim(),
      description: description.trim(),
    },
  });

  if (!todo) {
    logger.error("Error while creating todo");
    throw new APIError({
      message: "Error while creating todo",
      status: 500,
      success: false,
    });
  }

  client.del(baseUrl);
  logger.info({ todoId: todo.id }, "Todo created successfully");

  return todo;
};

export const getTodoService = async (
  query: Partial<Pick<Todo, "title" | "description">>,
  baseUrl: string,
) => {
  const invalidSearchQuery =
    Object.keys(query)
      .map((key) => key)
      .filter((key) => !VALID_SEARCH_QUERY.includes(key)).length > 0;

  if (invalidSearchQuery) {
    throw new APIError({
      message: "Invalid search query",
      status: 401,
      success: false,
    });
  }

  const key = convertURLToRedisKey(baseUrl, query);

  let cachedTodos;
  if (client.isOpen) {
    try {
      cachedTodos = await client.get(key);
    } catch (error) {
      logger.error(error, "Getting todo from redis failed");
    }
  }

  if (cachedTodos) {
    console.log("Cached hit");
    return JSON.parse(cachedTodos);
  }

  let whereQuery: any = {};

  if (query.title && query.title.length > 0) {
    whereQuery.title = { contains: query.title, mode: "insensitive" };
  }

  if (query.description && query.description.length > 0) {
    whereQuery.description = {
      contains: query.description,
      mode: "insensitive",
    };
  }

  const todos = await prisma.todo.findMany({
    where: whereQuery,
  });

  if (!todos) {
    logger.error("Something went wrong while fetching todos");

    throw new APIError({
      message: "Something went wrong while fetching the todos",
      status: 500,
      success: false,
    });
  }

  console.log("Cached miss");
  if (client.isOpen) {
    try {
      client.set(key, JSON.stringify(todos), {
        expiration: { type: "EX", value: 300 },
      });
    } catch (error) {
      logger.error(error, "Failed to set todo in redis");
    }
  }

  return todos;
};

export const deleteTodoService = async (params: Pick<Todo, "id">) => {
  const { id } = params;

  if (!id)
    throw new APIError({
      message: "Todo id is required to delete the todo",
      status: 400,
      success: false,
    });

  const numericId = Number(id);

  if (Number.isNaN(numericId))
    throw new APIError({
      message: "Invalid id",
      status: 400,
      success: false,
    });

  const todo = await prisma.todo.delete({
    where: { id: numericId },
  });

  if (!todo) {
    logger.error("Something went wrong while deleting todo");
    throw new APIError({
      message: `Error while deleting todo with id ${id}`,
      status: 500,
      success: false,
    });
  }

  if (client.isOpen) {
    try {
      await scanAndDeleteKey("api:todo*");
    } catch (error) {
      logger.error(
        error,
        "Something went wrong while deleting the stale redis keys",
      );
    }
  }

  logger.info({ todoId: todo.id }, "Todo deleted successfully");
};

export const updateTodoService = async (
  params: Pick<Todo, "id">,
  body: Partial<Omit<Todo, "id">>,
) => {
  const { id } = params;
  const { title: newTitle, description: newDescription } = body;

  if (!id)
    throw new APIError({
      message: "id is required to update todo",
      status: 400,
      success: false,
    });

  const numericId = Number(id);

  if (Number.isNaN(numericId))
    throw new APIError({
      message: "Invalid Id",
      status: 400,
      success: false,
    });

  const hasTitle = typeof newTitle === "string" && newTitle.trim().length > 0;
  const hasDescription =
    typeof newDescription === "string" && newDescription.trim().length > 0;

  if (!hasTitle && !hasDescription)
    throw new APIError({
      message: "Provide either title or description",
      status: 400,
      success: false,
    });

  const updateData: any = {};

  if (hasTitle) updateData.title = newTitle;

  if (hasDescription) updateData.description = newDescription;

  const updatedTodo = await prisma.todo.update({
    where: { id: numericId },
    data: updateData,
  });

  if (!updatedTodo) {
    logger.error("Something went wrong while updating the todo");

    throw new APIError({
      message: "Error in updating todo",
      status: 500,
      success: false,
    });
  }

  if (client.isOpen) {
    try {
      await scanAndDeleteKey("api:todo*");
    } catch (error) {
      logger.error(
        error,
        "Something went wrong while deleting the stale redis keys",
      );
    }
  }

  logger.info({ todoId: updatedTodo.id }, "Todo updated successfully");

  return updatedTodo;
};
