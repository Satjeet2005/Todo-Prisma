import type { Response, Request } from "express";
import { prisma } from "../config/prisma.ts";
import type { CreateTodo, DeleteTodo } from "../models/todo.model.ts";
import { errorResponse, isErrorResponse } from "../utility/errorResponse.ts";
import { successResponse } from "../utility/successResponse.ts";

export const createTodo = async (
  req: Request<{}, {}, CreateTodo>,
  res: Response,
) => {
  try {
    console.log(req.body);
    const { title, description } = req.body;

    if (!title)
      return errorResponse({
        res,
        status: 400,
        message: "Title is required to create the Todo",
        success: false,
      });

    if (!description)
      return errorResponse({
        res,
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

    if (!todo)
      return errorResponse({
        res,
        message: "Error while creating todo",
        status: 500,
        success: false,
      });

    console.log("Todo Created Successfully:", todo);

    return successResponse<CreateTodo>({
      res,
      data: todo,
      message: "Todo created successfully",
      status: 201,
      success: true,
    });
  } catch (error) {
    console.log("Error while creating the todo", error);

    const message = isErrorResponse(error)
      ? error.message
      : "Something went wrong while creating todo";

    return errorResponse({
      res,
      status: 500,
      message: message,
      success: false,
    });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany();

    if (!todos)
      return errorResponse({
        res,
        message: "Something went wrong while fetching the todos",
        status: 500,
        success: false,
      });

    console.log("Todos fetched successfully:", todos);

    return successResponse<CreateTodo[]>({
      res,
      data: todos,
      message: "Todos fetched successfully",
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log("Error while fetching the todos", error);

    const message = isErrorResponse(error)
      ? error.message
      : "Something went wrong while fetching the todos";

    return errorResponse({
      res,
      message: message,
      status: 500,
      success: false,
    });
  }
};

export const deleteTodo = async (
  req: Request<{}, {}, DeleteTodo>,
  res: Response,
) => {
  try {
    const { id } = req.body;

    if (!id)
      return errorResponse({
        res,
        message: "Todo id is required to delete the todo",
        status: 400,
        success: false,
      });

    const todo = await prisma.todo.delete({
      where: { id: id },
    });

    if (!todo)
      return errorResponse({
        res,
        message: `Error while deleting todo with id ${id}`,
        status: 500,
        success: false,
      });

    return successResponse({
      res,
      message: `Todo deleted successfully having id ${id}`,
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log("Error while deleting the todo", error);

    const message = isErrorResponse(error)
      ? error.message
      : "Something went wrong while deleting todo";

    return errorResponse({
      res,
      message: message,
      status: 500,
      success: false,
    });
  }
};
