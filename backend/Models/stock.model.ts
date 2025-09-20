import mongoose, { Document, Schema } from "mongoose";

interface StockSchema extends Document {
    vendorId: Schema.Types.ObjectId
    productName: string
    productQuantity: string
    productPrice: string
}

const StockSchema = new mongoose.Schema<StockSchema>({
    vendorId: { type: Schema.Types.ObjectId, required: true, ref: 'userData' },
    productName: { type: String, required: true, trim: true },
    productQuantity: { type: String, required: true, min: [1, "Quantity must be grater than 0"] },
    productPrice: { type: String, required: true, min: [1, "Price must be grater than 0"] }
},
    { timestamps: true }
);

export const Stock = mongoose.model<StockSchema>('vendorStock', StockSchema)