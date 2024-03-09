import mongoose from "mongoose";

const userRegister = new mongoose.Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true }
},
    { timestamps: true }
);

export const userRegisterModel = mongoose.model('userData', userRegister)