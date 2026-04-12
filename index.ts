import dotenv from "dotenv";
import express from "express";
import app from "./app.ts";
import errorHandler from "./src/middlewares/error.middleware.ts";
import todoRouter from "./src/routes/todo.route.ts";
import logger from "./src/utility/logger.ts";

const port = process.env.PORT || 3006;

dotenv.config({
  path: "./.env",
});

app.use(express.json());
app.use("/api/todo", todoRouter);

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server working at http://localhost:${port}`);
});
