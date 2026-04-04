import app from "./app.ts"
import todoRouter from "./src/routes/todo.route.ts"
import express from "express"
import dotenv from "dotenv"

const port = process.env.PORT || 3006;

dotenv.config({
    path:"./.env"
})

app.use(express.json())
app.use('/api/todo',todoRouter)

app.listen(port,() => {
    console.log(`Server working at http://localhost:${port}`)
})