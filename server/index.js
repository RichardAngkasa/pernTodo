const express = require('express');
const app = express(); 
const cors = require("cors");
const pool =  require("./db");

//middleware
app.use(cors());
app.use(express.json());

//ROUTES

//Create a todo =
app.post("/todos", async (req, res)=> {
    try {
        const {description} = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) Values($1) RETURNING *",
            [description]
        );
        res.json(newTodo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

//get all todos
app.get("/todos", async(req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.listen(5001, () => {
    console.log("server has started on port 5001");
});

// get a single todo
app.get("/todos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;
        await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]
        );
        res.json("Todo was update!");
    } catch (error) {
        console.error(error.message);
    }
});

//delete 
app.delete("/todos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo was deleted!");
    } catch (error) {
        console.log(error.message);
    }
});