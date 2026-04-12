import type { Response, Request } from "express";
import { prisma } from "../config/prisma.ts";
import type { Todo } from "../models/todo.model.ts";
import { APIError } from "../utility/Error.ts";
import { APISuccess } from "../utility/Success.ts";
import logger from "../utility/logger.ts";

export const createTodo = async (
  req: Request<{}, {}, Omit<Todo, "id">>,
  res: Response,
) => {
  try {
    const { title, description } = req.body;

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

    logger.info({ todoId: todo.id }, "Todo created successfully");

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

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany();

    if (!todos) {
      logger.error("Something went wrong while fetching todos");

      throw new APIError({
        message: "Something went wrong while fetching the todos",
        status: 500,
        success: false,
      });
    }

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

export const deleteTodo = async (
  req: Request<Pick<Todo, "id">, {}>,
  res: Response,
) => {
  try {
    const { id } = req.params;

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

    logger.info({ todoId: todo.id }, "Todo deleted successfully");

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

export const updateTodo = async (
  req: Request<Pick<Todo, "id">, {}, Partial<Omit<Todo, "id">>>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { title: newTitle, description: newDescription } = req.body;

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

    logger.info({ todoId: updatedTodo.id }, "Todo updated successfully");
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
