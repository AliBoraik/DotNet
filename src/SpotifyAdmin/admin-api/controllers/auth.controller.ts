import { Request, Response } from 'express';
const db = require('../db')
const jwt = require('jsonwebtoken')
const { secret } = require("../config")

const generateToken = (id: string, email: string, role: string) => {
    const payload = {
        id,
        email,
        role
    }

    return jwt.sign(payload, secret, { expiresIn: "24h"})
}

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const user = await db.query(`
                SELECT a.id, a.email, b.type
                FROM user_info as a
                JOIN profile as b on a.id = b.user_id
                WHERE email = $1 AND password = $2
            `, [email, password])

            if (!user.rows[0])
                return res.status(400).json({
                    message: 'Account with such credentials not found'
                })

            const token = generateToken(
                user.rows[0]['id'],
                user.rows[0]['email'],
                user.rows[0]['type']);

            res.json(token)
        }
        catch (e) {
            res.status(400).send({
                message: e.message
            });
        }
    }
}

module.exports = new AuthController();