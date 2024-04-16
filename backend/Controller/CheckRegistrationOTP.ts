import { Request, Response } from 'express'
import { registerOTPModel } from '../Models/RegisterOTP'
import { userSignUpModel } from '../Models/UserSignup'
import { userRegisterModel } from '../Models/RegisterUser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { validateRegisterUser } from '../Validation/ValidateUserRegisterData'
dotenv.config()

// Function for check the OTP and save user data 
export const checkRegistrationOTP = async (req: Request, res: Response) => {
    try {
        const checkOTP = await registerOTPModel.findOne({ "email": req.body.email }).exec();
        const vendorData = await userRegisterModel.findOne({ "email": req.body.email })

        if (checkOTP) {
            if (req.body.OTP === checkOTP?.otp) {
                req.body.password = await bcrypt.hash(req.body.password, 10);

                const newUserSignUpData = {
                    email: req.body.userEmail,
                    password: req.body.password
                };

                const newUserProfileData = {
                    vendorRef: vendorData?._id,
                    email: req.body.userEmail,
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

                const token = jwt.sign({ "email": req.body.email }, `${process.env.JWT_SECRETE_KEY}`, { expiresIn: '10 hr' });
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

// Function to update user data
export const updateUserData = async (req: Request, res: Response) => {
    try {
        const userData = await userRegisterModel.findOne({ "email": req.body.email });

        if (userData) {
            const validateUserData = await validateRegisterUser({
                email: req.body.userEmail,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                country: req.body.country,
                role: req.body.role,
                city: req.body.city
            });

            if (validateUserData.error) {
                res.status(400).json({ "message": validateUserData.error.details[0].message });
            }
            else {
                await userRegisterModel.findByIdAndUpdate(req.body.id, {
                    "email": req.body.userEmail,
                    "firstName": req.body.firstName,
                    "lastName": req.body.lastName,
                    "country": req.body.country,
                    "role": req.body.role,
                    "city": req.body.city
                }, { new: true }).then((data) => res.status(200).json({ "message": "Data updated successfully" })).catch((err) => res.status(500).json({ "message": "Something went wrong" }));
            }
        }
        else {
            res.status(400).json({ "message": "Something went wrong" });
        }
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong" });
    }
}

// Function to delete user data
export const deleteUserData = async (req: Request, res: Response) => {
    try {
        const userData = await userRegisterModel.findOne({ "email": req.body.email });

        if (userData) {
            await userRegisterModel.findByIdAndDelete(req.body.id).then((data) => {
                if (data) {
                    res.status(200).json({ "message": "User removed" })
                }
                else {
                    res.status(400).json({ "message": "Something went wrong" });
                }
            }
            ).catch(() => res.status(500).json({ "message": "Something went wrong" }));
        }
        else {
            res.status(400).json({ "message": "Something went wrong" });
        }
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong" });
    }
}