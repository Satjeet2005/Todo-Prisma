import { prisma } from "../config/prisma.ts";
import type { Todo } from "../models/todo.model.ts";
import { APIError } from "../utility/Error.ts";
import logger from "../utility/logger.ts";

export const createTodoService = async (body: Omit<Todo, "id">) => {
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

  logger.info({ todoId: todo.id }, "Todo created successfully");

  return todo;
};

export const getTodoService = async () => {
  const todos = await prisma.todo.findMany();

  if (!todos) {
    logger.error("Something went wrong while fetching todos");

    throw new APIError({
      message: "Something went wrong while fetching the todos",
      status: 500,
      success: false,
    });
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

  logger.info({ todoId: updatedTodo.id }, "Todo updated successfully");

  return updatedTodo;
};
