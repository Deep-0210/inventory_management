import { Response } from "express"

export const responseData = (res: Response, statusCode: number, message: string, data?: any) => {
    return res.status(statusCode).json({ message, data });
}

export const serverErrorMessage = (res: Response) => {
    return res.status(500).json({ message: "Internal Server Error" });
}