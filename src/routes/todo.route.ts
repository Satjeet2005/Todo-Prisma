import { Router } from "express";
import { createTodo } from "../controllers/todo.controller.ts";

const router = Router();

router
.post("/",createTodo)

export default router;