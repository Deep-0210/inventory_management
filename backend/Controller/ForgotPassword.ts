import { Request, Response } from "express";
import { validateEmail, validateSignUpUser } from "../Validation/ValidateCheckUserExist";
import { userSignUpModel } from "../Models/UserSignup";
import { userRegisterModel } from "../Models/RegisterUser";
import { userOtpModel } from "../Models/ForgotPasswordOTP";
import { ForgetOTPTemplate } from "../View/ForgetOTP";
import { userMail } from "../Utils/Mail";
import bcrypt from 'bcrypt'

export const generateForgetPasswordOTP = async (req: Request, res: Response) => {
    try {
        const validateData = await validateEmail({ email: req.body.email });

        if (validateData.error) {
            res.status(400).json({ "Message": validateData.error.details[0].message });
        }
        else {
            const userData = await userSignUpModel.findOne({ "email": req.body.email }).exec();

            const data = await userRegisterModel.findOne({ "email": req.body.email }).exec();

            if (userData) {
                const OTP = Math.floor(Math.random() * 1000000);

                const newOTP = {
                    email: req.body.email,
                    otp: OTP.toString()
                };

                const checkExistUSer = await userOtpModel.findOne({ "email": req.body.email }).exec();

                const template: string = ForgetOTPTemplate(OTP.toString(), data?.firstName, data?.lastName);
                const mail = await userMail(req.body.email, "testuser02002@gmail.com", template, "OTP from Inventory Management")

                if (mail.response) {
                    if (checkExistUSer) {
                        await userOtpModel.findByIdAndUpdate(checkExistUSer._id, { otp: OTP.toString() }, { new: true }).then(() => res.status(200).json({ "Message": "OTP Generated Successfully" })).catch((err) => res.status(500).json({ "Message": err }));
                    }
                    else {
                        const userOTP = new userOtpModel(newOTP);
                        await userOTP.save().then(() => res.status(200).json({ "Message": "OTP Generated Successfully" })).catch((err) => res.status(500).json({ "Message": err }));
                    }
                }
            }
            else {
                res.status(200).json({ "Message": "User not found" });
            }
        }
    } catch (error) {
        res.status(500).json({ "Message": "Something Went Wrong" });
    }
};

export const checkForgetPasswordOTP = async (req: Request, res: Response) => {
    try {
        const checkOTPExist = await userOtpModel.findOne({ "email": req.body.email });

        if (checkOTPExist) {
            if (checkOTPExist.otp === req.body.otp) {
                res.status(200).json({ "Message": "Correct OTP" });
            }
            else {
                res.status(200).json({ "Message": "Wrong OTP" });
            }
        }
        else {
            res.status(400).json({ "Message": "Something Went Wrong" });
        }
    } catch (error) {
        res.status(500).json({ "Message": "Something Went Wrong" });
    }
};

export const updateUserPassword = async (req: Request, res: Response) => {
    try {
        const validateUser = await validateSignUpUser(req.body);

        if (validateUser.error) {
            res.status(400).json({ "Message": validateUser.error.details[0].message });
        }
        else {
            const checkUserExist = await userSignUpModel.findOne({ "email": req.body.email }).exec();

            if (checkUserExist) {
                req.body.password = await bcrypt.hash(req.body.password, 10)

                await userSignUpModel.findOneAndUpdate(checkUserExist._id, { password: req.body.password }, { new: true }).then(() => res.status(200).json({ "Message": "Password Updated Successfully" })).catch((err) => res.status(500).json({ "Message": err }));
            }
            else {
                res.status(400).json({ "Message": "Something Went Wrong" });
            }
        }
    } catch (error) {
        res.status(500).json({ "Message": "Something Went Wrong" });
    }
}