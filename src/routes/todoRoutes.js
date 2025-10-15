import express from 'express'
import db from '../db.js'

const router = express.Router();

//show todos
router.get('/', (req, res) => {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?');
    const todos = getTodos.all(req.userId);
    res.json(todos)
})

//add todos
router.post('/', (req, res) => {
    const { task } = req.body;
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);
    const result = insertTodo.run(req.userId, task);
    res.json({ id: result.lastInsertRowid, task, completed: result.completed });
})

//update todos
router.put('/:id', (req, res) => {
    const {completed} = req.body;
    const {id} = req.params;

    const updateTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
    updateTodo.run(completed, id);

    res.json({message: "Todo Completed"});
});

//delete todos
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const userId = req.userId

    const deleteTodo = db.prepare('DELETE FROM todos WHERE user_id = ? AND id = ?');
    deleteTodo.run(userId, id);

    res.json({message: "Todo killed"});
});


export default router;