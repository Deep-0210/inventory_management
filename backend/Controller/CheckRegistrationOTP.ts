import { Request, Response } from 'express'
import { registerOTPModel } from '../Models/RegisterOTP'
import { userSignUpModel } from '../Models/UserSignup'
import { userRegisterModel } from '../Models/RegisterUser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

export const checkRegistrationOTP = async (req: Request, res: Response) => {
    try {
        const checkOTP = await registerOTPModel.findOne({ "email": req.body.email }).exec();

        if (checkOTP) {
            if (req.body.OTP === checkOTP?.otp) {
                req.body.password = await bcrypt.hash(req.body.password, 10);

                const newUserSignUpData = {
                    email: req.body.email,
                    password: req.body.password
                };

                const newUserProfileData = {
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    country: req.body.country,
                    role: req.body.role,
                    city: req.body.city
                };

                const userSignUp = new userSignUpModel(newUserSignUpData);
                await userSignUp.save().then().catch();

                const userProfileData = new userRegisterModel(newUserProfileData);
                await userProfileData.save().then().catch();

                const token = await jwt.sign({ "email": req.body.email }, `${process.env.JWT_SECRETE_KEY}`, { expiresIn: '10 hr' });
                res.status(200).json({ "Message": token });
            }
            else {
                res.status(200).json({ "Message": "Wrong OTP" });
            }
        }
        else {
            res.status(400).json({ "Message": "Something went Wrong!!" });
        }

    } catch (error) {
        res.status(500).json({ "Message": "Something Went Wrong!!" });
    }
}