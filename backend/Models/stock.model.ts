import mongoose, { Schema } from "mongoose";

const addStock = new mongoose.Schema({
    vendorId: { type: Schema.Types.ObjectId, required: true, ref: 'userData' },
    productName: { type: String, required: true, trim: true },
    productQuantity: { type: String, required: true, min: [1, "Quantity must be grater than 0"] },
    productPrice: { type: String, required: true, min: [1, "Price must be grater than 0"] }
},
    { timestamps: true }
);

export const addNewStock = mongoose.model('vendorStock', addStock)