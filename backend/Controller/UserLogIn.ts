import { Request, Response } from "express";
import { userSignUpModel } from "../Models/credentials.model";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { validateSignUpUser } from "../Validation/ValidateCheckUserExist";
import redisClient from '../redisClient';
dotenv.config()

export const UserLogIn = async (req: Request, res: Response) => {
    console.log(req.body)
    try {

        const cachedUser = await redisClient.get(`user:${req.body.email}`);

        if (cachedUser) {
            return res.status(200).json({ Message: 'Cached Token', Token: cachedUser });
        }

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
                    await redisClient.setEx(`user:${req.body.email}`, 60, token);
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