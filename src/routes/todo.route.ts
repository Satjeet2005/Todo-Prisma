import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
} from "../controllers/todo.controller.ts";

const router = Router();

router.post("/", createTodo).get("/", getTodos).delete("/", deleteTodo);

export default router;
