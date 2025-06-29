import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import route from './Routes/Routs';
import os from 'node:os';
import cluster from 'node:cluster';
import rateLimit from 'express-rate-limit';

dotenv.config();

const PORT = process.env.Server_Port || 3000;
const DB_URL = `${process.env.Database_Connection}/inventory`;

// Rate limiter middleware
// const globalLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 100,
//   message: 'Too many requests from this IP, try again in a minute.',
// });

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary process started: PID ${process.pid}`);
    // Fork workers based on number of CPU cores
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    console.log(`Worker process started: PID ${process.pid}`);

    import('./redisClient').then(async ({ default: redisClient }) => {
        await redisClient.connect();

        const app = express();
        app.use(express.json());
        app.use(cors());
        //   app.use(globalLimiter);
        app.use('/', route);

        mongoose
            .connect(DB_URL, { autoIndex: true })
            .then(() => console.log(`Database connected by PID ${process.pid}`))
            .catch((err) => console.error('Database connection error:', err));

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT} [PID ${process.pid}]`);
        });
    }).catch((err) => {
        console.error('Failed to connect to Redis:', err);
    })
}
