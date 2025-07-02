import { Request, Response } from "express";
import { userRegisterModel } from "../Models/user.model";
import { addNewStock } from "../Models/stock.model";
import { validateAddStockData } from "../Validation/ValidateNewStockData";
import { responseData } from "../Utils/responseHandler";

// Function for the addStock
export const addStock = async (req: Request, res: Response) => {
    try {
        const userData = await userRegisterModel.findOne({ "email": req.body.email });

        if (userData?._id) {

            const { productName, productQuantity, productPrice } = req.body;

            const newStock = {
                vendorId: userData?._id,
                productName: productName,
                productQuantity: productQuantity,
                productPrice: productPrice
            };

            const validateStockData = validateAddStockData({ productName: productName, productQuantity: productQuantity, productPrice: productPrice });

            if (validateStockData.error) {
                return responseData(res, 400, validateStockData?.error?.details[0]?.message);
            }
            else {
                const saveStockData = new addNewStock(newStock);
                await saveStockData.save().then(() => res.status(200).json({ "message": "Stock Added" })).catch((err) => res.status(500).json({ "message": err }));
            }
        }
        else {
            res.status(400).json({ "message": "Something went wrong" });
        }
    } catch (error) {
        res.status(500).json({ "message": "Something Went wrong" });
    }
}

// Function for get the stock daa as per the user
export const getStockData = async (req: Request, res: Response) => {
    try {
        const vendorData = await userRegisterModel.findOne({ "email": req.body.email });

        if (vendorData?._id) {
            const stockData = await addNewStock.find({ "vendorId": vendorData?._id }).select({ vendorId: 0, createdAt: 0, updatedAt: 0, __v: 0 })
            res.status(200).json({ "message": stockData });
        }
        else {
            res.status(400).json({ "message": "Something went wrong" });
        }
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong" })
    }
}

// Function for update the stock data
export const updateStockData = async (req: Request, res: Response) => {
    try {
        const userData = await userRegisterModel.findOne({ "email": req.body.email });
        if (userData) {

            const validateStockData = validateAddStockData({ productName: req.body.productName, productQuantity: req.body.productQuantity, productPrice: req.body.productPrice });

            if (validateStockData.error) {
                res.status(400).json({ "message": validateStockData.error?.details[0].message });
            }
            else {
                await addNewStock.findByIdAndUpdate(req.body.id, { "productName": req.body.productName, "productQuantity": req.body.productQuantity, "productPrice": req.body.productPrice }, { new: true }).then(() => res.status(200).json({ "message": "Data updated successfully" })).catch((err) => res.status(500).json({ "message": "Something went wrong" }));
            }
        }
        else {
            res.status(400).json({ "message": "Something went wrong" });
        }
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong" });
    }
}

// Function for delete stock data
export const removeStockData = async (req: Request, res: Response) => {
    try {
        const userData = await userRegisterModel.findOne({ "email": req.body.email });

        if (userData) {
            await addNewStock.findByIdAndDelete({ "_id": req.body.id }).then((data) => {
                if (data) {
                    res.status(200).json({ "message": "Data removed " });
                }
                else {
                    res.status(400).json({ "message": "Something went wrong" });
                }
            }).catch((err) => res.status(500).json({ "message": "Something went wrong" }));
        }
        else {
            res.status(400).json({ "message": "Something went wrong" });
        }
    } catch (error) {
        res.status(500).json({ "message": "Something went wrong" });
    }
}