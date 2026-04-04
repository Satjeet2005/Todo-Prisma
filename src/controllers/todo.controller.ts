import type { Response, Request } from "express";
import { prisma } from "../config/prisma.ts";
import type { Todo } from "../models/todo.model.ts";
import { errorResponse } from "../utility/errorResponse.ts";
import { successResponse } from "../utility/successResponse.ts";

export const createTodo = async (req: Request<{}, {}, Todo>, res: Response) => {
  try {
    console.log(req.body);
    const { title, description } = req.body;

    if (!title)
      throw errorResponse({
        status: 400,
        message: "Title is required to create the Todo",
        success: false,
      });

    if (!description)
      throw errorResponse({
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
      throw errorResponse({
        message: "Error while creating todo",
        status: 500,
        success: false,
      });

    console.log("Todo Created Successfully:", todo);

    res.json(
      successResponse<Todo>({
        data: todo,
        message: "Todo created successfully",
        status: 201,
        success: true,
      }),
    );
  } catch (error) {
    console.log(error);

    throw errorResponse({
      status: 500,
      message: "Something went wrong while creating the todo",
      success: false,
    });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany();

    if (!todos)
      throw errorResponse({
        message: "Something went wrong while fetching the todos",
        status: 500,
        success: false,
      });

    console.log("Todos fetched successfully:", todos);

    res.json(
      successResponse<Todo[]>({
        data: todos,
        message: "Todos fetched successfully",
        status: 200,
        success: true,
      }),
    );
  } catch (error) {
    console.log("Error while fetching the todos", error);
    throw errorResponse({
      message: "Something went wrong while fetching the todos",
      status: 500,
      success: false,
    });
  }
};
