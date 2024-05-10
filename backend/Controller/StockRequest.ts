import { Request, Response } from "express";
import { userRegisterModel } from "../Models/RegisterUser";
import { addNewStock } from "../Models/AddStock";
import { userMail } from "../Utils/Mail";
import { SendStockRequest } from "../View/sendStockRequest";
import { userRequestedStock } from "../Models/requestedStock";
import { userRespondedStock } from "../Models/respondedStock";
import { SendStockResponse } from "../View/sendStockResponse";

// api for get the stock data for user for send the request for get new stock
export const getUserStock = async (req: Request, res: Response) => {
    try {
        const userData = await userRegisterModel.findOne({ "email": req.body.email }).exec();

        if (userData) {
            const stockData = await addNewStock.find({ "vendorId": userData?.vendorRef }).select({ vendorId: 0, createdAt: 0, updatedAt: 0, __v: 0 });
            res.status(200).json({ "message": stockData });
        }
        else {
            res.status(400).json({ "message": "Something Went Wrong!!" });
        }
    } catch (error) {
        res.status(500).json({ "message": "Something Went Wrong!!" });
    }
};

// api for send the mail to the vendor from the requestVendor 
export const sendRequestMail = async (req: Request, res: Response) => {
    try {
        const userData = await userRegisterModel.findOne({ "email": req.body.email }).exec();

        if (userData) {
            const emailForStockRequest = await userRegisterModel.findOne({ "_id": userData?.vendorRef });

            const template = SendStockRequest(emailForStockRequest?.firstName as string, emailForStockRequest?.lastName as string, req.body.productName, req.body.productPrice, req.body.productQuantity);

            const mail = await userMail(emailForStockRequest?.email as string, userData?.email, template, `Stock request from ${userData?.firstName} ${userData?.lastName}`);

            if (mail?.response) {
                const newData = {
                    requestedId: userData?._id,
                    attendantId: emailForStockRequest?._id,
                    productName: req.body.productName,
                    productPrice: req.body.productPrice,
                    productQuantity: req.body.productQuantity,
                    status: "pending"
                };

                const requestedData = new userRequestedStock(newData);

                await requestedData.save().then(() => res.status(200).json({ "message": "Request Send Successfully!!" })).catch(() => res.status(500).json({ "message": "Something Went Wrong!!" }));
            }
            else {
                res.status(500).json({ "message": "Something Went Wrong!!" })
            }
        }
        else {
            res.status(400).json({ "message": "Something Went Wrong!!" });
        }

    } catch (error) {
        res.status(400).json({ "message": "Something Went Wrong!!" });
    }
};

// api for set the status of restedStock request
export const answerRequestedStock = async (req: Request, res: Response) => {
    try {
        const userData = await userRegisterModel.findOne({ "email": req.body.email });
        if (userData) {
            // const session = await userRequestedStock.startSession();
            // session.startTransaction();

            // try {
            const requestedData = await userRequestedStock.findOne({ "_id": req.body.id });

            if (requestedData) {
                const subUserData = await userRegisterModel.findOne({ "_id": requestedData?.requestedId });
                const newData = {
                    requestedId: (requestedData?.requestedId)?.toHexString(),
                    attendantId: (requestedData?.attendantId)?.toHexString(),
                    productName: requestedData?.productName,
                    productPrice: requestedData?.productPrice,
                    productQuantity: requestedData?.productQuantity,
                    status: req.body.status + 'ed',
                }

                // await userRequestedStock.findByIdAndDelete(req.body.id);
                // try {
                const respondedData = new userRespondedStock(newData);

                const template = SendStockResponse(subUserData?.firstName as string, subUserData?.lastName as string, requestedData?.productName as string, requestedData?.productPrice as string, requestedData?.productQuantity as string, req.body.status + 'ed')

                const mail = await userMail(subUserData?.email as string, userData?.email, template, `Stock response from ${userData?.firstName} ${userData?.lastName}`)

                if (mail?.response) {
                    await respondedData.save().then(() => res.status(200).json({ "message": "Request Updated Successfully!!" })).catch((err) => res.status(500).json({ "message": err }));
                }


                // await session.commitTransaction();
                // session.endSession();

                // } catch (error) {
                //     await userRequestedStock.create(requestedData);
                //     res.status(500).json({ "message": "something Went Wrong1" })
                // }
            }

            // } catch (error) {
            //     await session.abortTransaction();
            //     session.endSession();

            //     res.status(500).json({ "message": "Something Went Wrong2" });
            // }
        }
        else {
            res.status(400).json({ "message": "Something Went Wrong3" });
        }
    }
    catch (error) {
        res.status(500).json({ "message": "Something Went Wrong!!4" });
    }
};

// api for get the stock request for pending status
export const getPendingStockRequestedData = async (req: Request, res: Response) => {
    try {
        const userData = await userRegisterModel.findOne({ "email": req.body.email });

        if (userData) {
            const requestedData = await userRequestedStock.find({ "attendantId": userData?._id, "status": "pending" }).select({ createdAt: 0, updatedAt: 0, __v: 0, requestedId: 0, attendantId: 0 });

            res.status(200).json({ "message": requestedData });
        }
    } catch (error) {
        res.status(500).json({ "message": "Something Went Wrong" });
    }
};

// api for get the stock request for accept or rejected status
export const getRespondedStockRequestedData = async (req: Request, res: Response) => {
    try {
        const userData = await userRegisterModel.findOne({ "email": req.body.email });

        if (userData) {
            const requestedData = await userRespondedStock.find({ "attendantId": userData?._id }).select({ createdAt: 0, updatedAt: 0, __v: 0, requestedId: 0, attendantId: 0 });

            res.status(200).json({ "message": requestedData });
        }
    } catch (error) {
        res.status(500).json({ "message": "Something Went Wrong" });
    }
};