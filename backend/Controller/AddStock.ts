import { Request, Response } from "express";
import { userRegisterModel } from "../Models/RegisterUser";
import { addNewStock } from "../Models/AddStock";
import { validateAddStockData } from "../Validation/ValidateNewStockData";

// Function for the addStock
export const addStock = async (req: Request, res: Response) => {
    try {
        const userData = await userRegisterModel.findOne({ "email": req.body.email });

        if (userData?._id) {
            const newStock = {
                vendorId: userData?._id,
                productName: req.body.productName,
                productQuantity: req.body.productQuantity,
                productPrice: req.body.productPrice
            };

            const validateStockData = validateAddStockData({ productName: req.body.productName, productQuantity: req.body.productQuantity, productPrice: req.body.productPrice });

            if (validateStockData.error) {
                res.status(400).json({ "message": validateStockData?.error?.details[0]?.message });
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