import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controllers/todo.controller.ts";

const router = Router();

router
  .post("/", createTodo)
  .get("/", getTodos)
  .delete("/:id", deleteTodo)
  .patch("/:id", updateTodo);

export default router;
