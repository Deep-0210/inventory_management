import { Request, Response } from "express";


export const addStock = (req: Request, res: Response) => {
    try {
        console.log(req.body, 'Data in addStock')

        res.status(200).json({ "message": req.body })
    } catch (error) {
        res.status(500).json({ "message": "Something Went Wrong" })
    }
}