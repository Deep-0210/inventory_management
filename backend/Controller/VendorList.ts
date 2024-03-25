import { Request, Response } from "express";
import { userRegisterModel } from "../Models/RegisterUser";

export const getVendorList = async (req: Request, res: Response) => {
    try {
        const mainUser = await userRegisterModel.findOne({ "email": req.body.email });

        const vendorList = await userRegisterModel.find({ "vendorRef": mainUser?._id }).select({ _id: 0, vendorRef: 0, createdAt: 0, updatedAt: 0, __v: 0 });
        res.status(200).json({ "message": vendorList });

    } catch (error) {
        res.status(500).json({ "message": "Something went wrong" })
    }
}