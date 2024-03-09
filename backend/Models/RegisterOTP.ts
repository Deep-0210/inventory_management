import mongoose from 'mongoose'

const registerOTP = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true }
},
    { timestamps: true }
);

export const registerOTPModel = mongoose.model('registerOTP', registerOTP);