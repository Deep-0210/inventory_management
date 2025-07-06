import mongoose from "mongoose";

const userOTP = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, require: true },
    otpType: { type: String, require: true, enum: ['forgotOtp', 'userRegisterOtp'] }
},
    { timestamps: true }
);

export const otpModel = mongoose.model('forgetOTP', userOTP);