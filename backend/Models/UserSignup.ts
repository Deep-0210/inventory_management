import mongoose from "mongoose";

const userSignUp = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
},
    { timestamps: true }
);

export const userSignUpModel = mongoose.model('signupUser', userSignUp)