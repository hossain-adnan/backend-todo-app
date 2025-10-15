import jwt from 'jsonwebtoken'
import 'dotenv/config'

function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send({message: "Invalid token"});

        req.userId = decoded.id
        next();
    })
}

export default authMiddleware;