import { Request, Response } from "express";
import { registerOTPModel } from "../Models/RegisterOTP";
import { validateRegisterUser } from "../Validation/ValidateUserRegisterData";
import { createProfile } from "../View/CreateProfile";
import { userMail } from "../Utils/Mail";

export const registrationOTP = async (req: Request, res: Response) => {
    try {
        const validateUserRegistrationData = await validateRegisterUser({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            country: req.body.country,
            role: req.body.role,
            city: req.body.city
        });

        if (validateUserRegistrationData.error) {
            res.status(400).json({ "Message": validateUserRegistrationData.error.details[0].message });
        }
        else {
            const OTP = Math.floor(Math.random() * 1000000);

            const userOTP = {
                email: req.body.email,
                otp: OTP
            };

            const checkOTPExist = await registerOTPModel.findOne({ "email": req.body.email }).exec();

            const template = createProfile(OTP.toString(), req.body.firstName, req.body.lastName);
            const mail = await userMail(req.body.email, "testuser02002@gmail.com", template, "OTP from Inventory Management");

            if (mail.response) {
                if (checkOTPExist) {
                    await registerOTPModel.findByIdAndUpdate(checkOTPExist._id, { "otp": OTP }, { new: true }).then(() => res.status(200).json({ "Message": "OTP Generated" })).catch((err) => res.status(500).json({ "Message": err }));
                }
                else {
                    const newOTP = new registerOTPModel(userOTP);
                    newOTP.save().then(() => res.status(200).json({ "Message": "OTP Generated", OTP: OTP.toString() })).catch((err) => res.status(500).json({ "Message": err }));
                }
            }
        }
    } catch (error) {
        res.status(500).json({ "Message": "Something Went Wrong!!" });
    }
};