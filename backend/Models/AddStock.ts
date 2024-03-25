import mongoose, { Schema } from "mongoose";

const addStock = new mongoose.Schema({
    vendorId: { type: Schema.Types.ObjectId, require: true, ref: 'userData' },
    productName: { type: String, require: true },
    productQuantity: { type: String, require: true },
    productPrice: { type: String, require: true }
},
    { timestamps: true }
);

export const addNewStock = mongoose.model('vendorStock', addStock)