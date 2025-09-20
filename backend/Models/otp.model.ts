import mongoose from "mongoose";

const userOTP = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    otpType: { type: String, required: true, enum: ['forgotOtp', 'userRegisterOtp'] }
},
    { timestamps: true }
);

export const otpModel = mongoose.model('otp', userOTP);

// const checkOtpIndexCreated = async () => {
//     await otpModel.collection.getIndexes().then((res) => console.log(res)).catch((err) => console.log(err))
// }

// checkOtpIndexCreated()
