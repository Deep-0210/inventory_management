import { Response } from "express"

export const responseData = (res: Response, statusCode: number, message: string) => {
    return res.status(statusCode).json({ message: message });
}