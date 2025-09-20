import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const DB_URL = `${process.env.Database_Connection}/inventory`;

export const connectDb = () => {
    mongoose.connect(DB_URL, { autoIndex: true, serverSelectionTimeoutMS: 30000 })
        .then(() => console.log(`Database connected by PID ${process.pid}`))
        .catch((err) => console.error('Database connection error:', err));
}