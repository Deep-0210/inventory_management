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

// const checkIndexCreated = async () => {
//     await userRegisterModel.collection.getIndexes().then((res) => {
//         console.log(`Created Index for User model:`, res)
//     }).catch((err) => {
//         console.log("Something wrong in User Model Indexing", err)
//     })
// };

// checkIndexCreated();