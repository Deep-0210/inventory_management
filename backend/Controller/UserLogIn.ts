import { Request, Response } from "express";
import { userSignUpModel } from "../Models/UserSignup";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { validateSignUpUser } from "../Validation/ValidateCheckUserExist";
dotenv.config()

export const UserLogIn = async (req: Request, res: Response) => {
    try {
        const userData = await userSignUpModel.findOne({ "email": req.body.email }).exec();

        if (userData) {

            const validateCredentials = await validateSignUpUser(req.body)

            if (validateCredentials.error) {
                res.status(400).json({ "Message": validateCredentials.error.details[0].message });
            }
            else {
                const validatePassword = await bcrypt.compare(req.body.password, userData.password);

                if (validatePassword) {
                    const token = await jwt.sign({ "email": userData.email }, `${process.env.JWT_SECRETE_KEY}`);
                    res.status(200).json({ "Message": token });
                }
                else {
                    res.status(200).json({ "Message": "Please check your email or password" });
                }
            }
        }
        else {
            res.status(200).json({ "Message": "User Not Found" });
        }
    } catch (error) {
        res.status(500).json({ "Message": error });
    }
};