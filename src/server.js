import express from 'express'
import path, { dirname } from 'path';
import {fileURLToPath} from 'url'
import authRoutes from './routes/authRoutes.js'
import authMiddleware from './middlewares/authMiddleware.js'
import todoRoutes from './routes/todoRoutes.js'

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

//Routes
app.use('/auth', authRoutes);
app.use('/todos', authMiddleware, todoRoutes);

app.get('/', (req, res) => {
    res.status(200);
});

app.listen(PORT, () => {
    console.log(`The server has started from the ${PORT}`);
});