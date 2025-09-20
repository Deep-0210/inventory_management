import mongoose, { Document, Schema } from "mongoose";

interface UserRegister extends Document {
    vendorRef: Schema.Types.ObjectId,
    email: string,
    firstName: string
    lastName: string
    country: string
    city: string
    role: 'superVendor' | 'adminVendor' | 'vendor',
    password: string
}

const UserSchema = new mongoose.Schema<UserRegister>({
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

export const User = mongoose.model<UserRegister>('userData', UserSchema)

// const checkIndexCreated = async () => {
//     await userRegisterModel.collection.getIndexes().then((res) => {
//         console.log(`Created Index for User model:`, res)
//     }).catch((err) => {
//         console.log("Something wrong in User Model Indexing", err)
//     })
// };

// checkIndexCreated();