import { Request, Response } from 'express';
const db = require('../db')

class UserController {
    async getUsers(req: Request, res: Response) {
        try {
            const offset = req.query.offset,
                  limit = req.query.limit,
                  userType = req.query.userType

            if (!offset)
                res.status(400).send({
                    message: "Offset query param is missing"
                })
            if (!limit)
                res.status(400).send({
                    message: "Limit query param is missing"
                })

            let query = `
                        SELECT id, email
                        FROM user_info
                        JOIN profile ON user_info.id = profile.user_id `
            if (userType)
                query += `WHERE type = ${userType} `

            query += `OFFSET $1 LIMIT $2 `
            const users = await db.query(query, [offset, limit])
            res.json(users.rows);
        }
        catch (e) {
            res.status(400).send({
                message: e.message
            });
        }
    }

    async getUserByID(req: Request, res: Response) {
        try {
            const id = req.params.id
            const user = await db.query(`
                SELECT a.id, a.email, c.username, c.type AS user_type, 
                    to_char(c.birthday :: DATE, 'Mon dd, yyyy') as birthday,
                    c.country, b.type as premium_type, 
                    to_char(b.start_at, 'Mon dd, yyyy HH12:MI:SS') as premium_started_at,
                    to_char(b.end_at, 'Mon dd, yyyy HH12:MI:SS') as premium_ends_at
                FROM user_info AS a
                JOIN premium as b on a.id = b.user_id
                JOIN profile as c on a.id = c.user_id
                WHERE a.id = $1 AND c.type != 'admin'`,
                [id])
            res.json(user.rows[0])
        }
        catch (e) {
            res.status(400).send({
                message: e.message
            });
        }
    }

    async getUsersByEmail(req: Request, res: Response) {
        try {
            const offset = req.query.offset,
                limit = req.query.limit,
                userType = req.query.userType,
                email = req.params.email

            if (!offset)
                res.status(400).send({
                    message: "Offset query param is missing"
                })
            if (!limit)
                res.status(400).send({
                    message: "Limit query param is missing"
                })

            let query = `
                SELECT id, email
                FROM user_info as a `

            if (userType)
                query += ` 
                    JOIN profile as b ON a.id = b.user_id 
                    WHERE email ~* ('.*' || '${email}' || '.*')
                    AND b.type = '${userType}' `
            else {
                query += `WHERE email ~* ('.*' || '${email}' || '.*')`
            }

            query += ` OFFSET $1 LIMIT $2`
            const users = await db.query(query, [offset, limit])
            res.json(users.rows)
        }
        catch (e) {
            res.status(400).send({
                message: e.message
            });
        }
    }
}

module.exports = new UserController();