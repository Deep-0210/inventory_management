import { Response } from "express"

export const responseData = (res: Response, statusCode: number, message: string, data?: object | null | undefined | string) => {
    return res.status(statusCode).json({ message, data });
}

export const serverErrorMessage = (res: Response, error: object) => {
    return res.status(500).json({ message: "Internal Server Error", error });
}