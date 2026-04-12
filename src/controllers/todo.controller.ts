import type { Response, Request } from "express";
import { prisma } from "../config/prisma.ts";
import type { Todo } from "../models/todo.model.ts";
import { APIError } from "../utility/Error.ts";
import { APISuccess } from "../utility/Success.ts";
import logger from "../utility/logger.ts";
import {
  createTodoService,
  deleteTodoService,
  getTodoService,
  updateTodoService,
} from "../services/todo.service.ts";

export const createTodoController = async (
  req: Request<{}, {}, Omit<Todo, "id">>,
  res: Response,
) => {
  try {
    const todo = await createTodoService(req.body);

    return res.status(201).json(
      new APISuccess<Todo>({
        data: todo,
        message: "Todo created successfully",
        status: 201,
        success: true,
      }),
    );
  } catch (error) {
    logger.error(error);

    const message =
      error instanceof APIError
        ? error.message
        : "Something went wrong while creating todo";

    throw new APIError({
      status: 500,
      message: message,
      success: false,
    });
  }
};

export const getTodosController = async (req: Request, res: Response) => {
  try {
    const todos = await getTodoService();

    return res.status(200).json(
      new APISuccess<Todo[]>({
        data: todos,
        message: "Todos fetched successfully",
        status: 200,
        success: true,
      }),
    );
  } catch (error) {
    logger.error(error);

    const message =
      error instanceof APIError
        ? error.message
        : "Something went wrong while fetching the todos";

    throw new APIError({
      message: message,
      status: 500,
      success: false,
    });
  }
};

export const deleteTodoController = async (
  req: Request<Pick<Todo, "id">>,
  res: Response,
) => {
  try {
    await deleteTodoService(req.params);

    return res.status(200).json(
      new APISuccess({
        message: "Todo deleted successfully",
        status: 200,
        success: true,
      }),
    );
  } catch (error) {
    logger.error(error);

    const message =
      error instanceof APIError
        ? error.message
        : "Something went wrong while deleting todo";

    throw new APIError({
      message: message,
      status: 500,
      success: false,
    });
  }
};

export const updateTodoController = async (
  req: Request<Pick<Todo, "id">, {}, Partial<Omit<Todo, "id">>>,
  res: Response,
) => {
  try {
    const updatedTodo = await updateTodoService(req.params, req.body);

    res.status(200).json(
      new APISuccess<Todo>({
        message: "Todo updated successfully",
        status: 200,
        success: true,
        data: updatedTodo,
      }),
    );
  } catch (error) {
    logger.error(error);

    const message =
      error instanceof APIError
        ? error.message
        : "Something went wrong while updating todo";

    throw new APIError({
      message: message,
      status: 500,
      success: false,
    });
  }
};
