import express, { Router } from 'express'
import db from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config'


const router = express.Router();

router.post('/register', (req, res) => {

    const { username, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 8);
    console.log(hashedPassword)

    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
        const result = insertUser.run(username, hashedPassword);

        const defaultTodo = 'Hello! Add your first todo :)';
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);
        insertTodo.run(result.lastInsertRowid, defaultTodo);

        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });

    } catch (error) {
        console.log(error.message);
        res.status(503).send(error.message);
    }
})

//Login
router.post('/login', (req, res) => {
    //check the username and password with the database
    const { username, password } = req.body;
    try {
        const getUser = db.prepare(`SELECT * FROM users where username = ?`);
        const user = getUser.get(username);

        if (!user) return res.status(404).send({ message: "User not found" });

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) return res.status(404).send({ message: "Password invalid" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.send({token});
    } catch (error) {
        console.log(error.message);
        res.status(503).send(error.message);
    }
})


export default router;