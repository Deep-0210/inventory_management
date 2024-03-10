import mongoose from "mongoose";

const userRegister = new mongoose.Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    role: { type: String, required: true, enum: ['superVendor', 'adminVendor', 'vendor'] }
},
    { timestamps: true }
);

export const userRegisterModel = mongoose.model('userData', userRegister)