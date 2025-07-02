import { Request, Response } from "express";
import { userRegisterModel } from "../Models/user.model";
import { validateRegisterUser } from "../Validation/ValidateUserRegisterData";
import { userSignUpModel } from "../Models/credentials.model";

export const getVendorList = async (req: Request, res: Response) => {
    try {
        const mainUser = await userRegisterModel.findOne({ "email": req.body.email });

        const vendorList = await userRegisterModel.find({ "vendorRef": mainUser?._id }).select({ vendorRef: 0, createdAt: 0, updatedAt: 0, __v: 0 });
        res.status(200).json({ "message": vendorList });

    } catch (error) {
        res.status(500).json({ "message": "Something went wrong" })
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
                }, { new: true }).then((data) => res.status(200).json({ "message": "userData updated successfully" })).catch((err) => res.status(500).json({ "message": "Something went wrong" }));
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

            const removeUSerData = await userRegisterModel.findOne({ "_id": req.body.id });
            if (removeUSerData) {

                await userRegisterModel.findByIdAndDelete(req.body.id).then(async (data) => {
                    if (data) {

                        const signUpData = await userSignUpModel.findOne({ "email": removeUSerData?.email })

                        await userSignUpModel.findByIdAndDelete(signUpData?._id).then(() => {
                            res.status(200).json({ "message": "User removed" });
                        }).catch(() => res.status(500).json({ "message": "Something Went" }));
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
        }
        else {
            res.status(400).json({ "message": "Something went wrong" });
        }
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong" });
    }
}