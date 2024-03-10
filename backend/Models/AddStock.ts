import mongoose from "mongoose";

const addStock = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: String, required: true }
},
    { timestamps: true }
);

export const addNewStock = mongoose.model('stock', addStock )