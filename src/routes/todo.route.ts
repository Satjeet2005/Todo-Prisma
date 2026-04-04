import { Router } from "express";
import { createTodo, getTodos } from "../controllers/todo.controller.ts";

const router = Router();

router.post("/", createTodo).get("/", getTodos);

export default router;
