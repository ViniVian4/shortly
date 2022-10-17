import connection from '../database/database.js'
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

async function register(req, res) {
    const { name, email, password } = res.locals.body;

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        if (await connection.query(`SELECT * FROM users WHERE email = $1;`, [email])) {
            return res.sendStatus(409);
        }

        await connection.query(`INSERT INTO users (name, email, password))
        VALUES ($1, $2, $3)`, [name, email, passwordHash]);

        return res.sendStatus(201);

    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function login(req, res) {
    const { email, password } = res.locals.body;

    try {
        const user = await connection.query(`SELECT * FROM users
        WHERE email = $1`, [email]);
        
        if (!user) {
            return res.sendStatus(401)
        }

        const isPasswordValid = bcrypt.compareSync(password, user.rows[0].password);

        if (!isPasswordValid) {
            return res.sendStatus(401);
        }

        const session = await connection.query(`SELECT * FROM sessions
        WHERE active = TRUE AND "userId" = $1`, [user.rows[0].id]);

        const token = uuid();

        if (session) {
            await connection.query(`UPDATE sessions SET "active" = FALSE
            WHERE "id" = $1`, [session.rows[0].id]);

            await connection.query(`INSERT INTO sessions
            ("userId", "token") VALUES ($1, $2)`, 
            [user.rows[0].id, token]);
        } 
        else {
            await connection.query(`INSERT INTO sessions
            ("userId", "token") VALUES ($1, $2)`, 
            [user.rows[0].id, token]);
        }

        return res.status(200).send({ token });


    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function logout (req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const session = await connection.query(`SELECT * FROM sessions
        WHERE active = TRUE AND "token" = $1`, [token]);

        if (!session) {
            return res.sendStatus(401);
        }

        await connection.query(`UPDATE sessions SET "active" = FALSE
            WHERE "token" = $1`, [token]);
        
            return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export { register, login, logout };