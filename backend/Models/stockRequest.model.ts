import mongoose, { Schema } from "mongoose";

const requestedStock = new mongoose.Schema({
    requestedId: { type: Schema.Types.ObjectId, ref: "userData", require: true },
    attendantId: { type: Schema.Types.ObjectId, ref: "userData", require: true },
    productName: { type: String, require: true },
    productPrice: { type: String, require: true },
    productQuantity: { type: String, require: true },
    status: { type: String, require: true, enum: ['pending', 'accepted', 'rejected'] }
},
    { timestamps: true }
);

export const userRequestedStock = mongoose.model('requestedStock', requestedStock);