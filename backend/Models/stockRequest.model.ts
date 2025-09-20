import mongoose, { Schema } from "mongoose";

interface RequestedStock extends Document {
    requestedId: Schema.Types.ObjectId
    attendantId: Schema.Types.ObjectId
    productName: string
    productPrice: string
    productQuantity: string
    status: "pending" | "accepted" | "rejected";
}

const RequestStockSchema = new mongoose.Schema<RequestedStock>({
    requestedId: { type: Schema.Types.ObjectId, ref: "userData", required: true },
    attendantId: { type: Schema.Types.ObjectId, ref: "userData", required: true },
    productName: { type: String, required: true },
    productPrice: { type: String, required: true },
    productQuantity: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'accepted', 'rejected'] }
},
    { timestamps: true }
);

export const RequestedStock = mongoose.model<RequestedStock>('requestedStock', RequestStockSchema);