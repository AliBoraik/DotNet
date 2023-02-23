import {NextFunction, Request, Response} from "express";
const jwt = require('jsonwebtoken')
const { secret } = require('../config')

interface RequestExtension extends Request {
    user: string
}

module.exports = function (req: RequestExtension, res: Response, next: NextFunction) {
    if (req.method === "OPTIONS")
        next()
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token)
            return res.status(403).json({
                message: "Unauthorized"
            })

        const data = jwt.verify(token, secret)

        if (data['role'] !== 'admin')
            return res.status(403).json({
                message: "Insufficient permissions"
            })

        req.user = data;
        next()
    }
    catch (e) {
        return res.status(403).json({
            message: "Unauthorized"
        })
    }
}