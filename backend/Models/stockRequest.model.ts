import mongoose, { Schema } from "mongoose";

const requestedStock = new mongoose.Schema({
    requestedId: { type: Schema.Types.ObjectId, ref: "userData", required: true },
    attendantId: { type: Schema.Types.ObjectId, ref: "userData", required: true },
    productName: { type: String, required: true },
    productPrice: { type: String, required: true },
    productQuantity: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'accepted', 'rejected'] }
},
    { timestamps: true }
);

export const userRequestedStock = mongoose.model('requestedStock', requestedStock);