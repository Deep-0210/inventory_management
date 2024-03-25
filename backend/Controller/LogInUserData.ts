import { userRegisterModel } from "../Models/RegisterUser";
import { Request, Response } from 'express';

// Function to get logIn user data
export const logInUserData = async (req: Request, res: Response) => {
    try {
        const userData = await userRegisterModel.findOne({ "email": req.body.email });

        res.status(200).json({ "Message": userData });
    } catch (error) {
        res.status(500).json({ "Message": error });
    }
};