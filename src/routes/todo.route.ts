import { Router } from "express";
import {
  createTodoController,
  deleteTodoController,
  getTodosController,
  updateTodoController,
} from "../controllers/todo.controller.ts";

const router = Router();

router
  .post("/", createTodoController)
  .get("/", getTodosController)
  .delete("/:id", deleteTodoController)
  .patch("/:id", updateTodoController);

export default router;
