import mongoose, { Schema } from "mongoose";

const userRegister = new mongoose.Schema({
    vendorRef: { type: Schema.Types.ObjectId, required: true, ref: "userData" },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    role: { type: String, required: true, enum: ['superVendor', 'adminVendor', 'vendor'] },
    password: { type: String, required: true }
},
    { timestamps: true }
);

export const userRegisterModel = mongoose.model('userData', userRegister)

userRegisterModel.createIndexes().then(() => console.log("userRegisterModel index created successfully")).catch((err) => console.log(`Index creation fail: ${err}`))