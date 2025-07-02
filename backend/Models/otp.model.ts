import mongoose from "mongoose";

const userOTP = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, require: true }
},
    { timestamps: true }
);

export const userOtpModel = mongoose.model('forgetOTP', userOTP);