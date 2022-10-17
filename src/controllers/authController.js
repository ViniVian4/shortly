import connection from '../database/database.js'
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

async function register(req, res) {
    let { name, email, password } = res.locals.body;

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

export { register };