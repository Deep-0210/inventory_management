import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

export const middleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.token as string

        const decodeToken = jwt.verify(token, `${process.env.JWT_SECRETE_KEY}`) as JwtPayload;
        if (decodeToken) {
            req.body.email = decodeToken.email
            next();
        }
    } catch (error) {
        res.status(401).json({ "Message": "Unauthorized Access" });
    }
}