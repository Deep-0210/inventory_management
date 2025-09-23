import express, { NextFunction, Request, Response } from 'express';
// import mongoose from 'mongoose'\;
import cors from 'cors';
import dotenv from 'dotenv';
import route from './Routes';
// import os from 'node:os';
// import cluster from 'node:cluster'\;
// import rateLimit from 'express-rate-limit';
import { connectDb } from './db/db.connect';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import fs from 'fs'

dotenv.config();

const PORT = process.env.Server_Port || 3000;

// Rate limiter middleware
// const globalLimiter = rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minute
//     max: 100,
//     message: 'Too many requests from this IP, try again in a minute.',
// });

// const numCPUs = os.cpus().length;

const requestLogs = async (req: Request, res: Response, next: NextFunction) => {

    const log = new Date().toISOString().split("T")[0] + " | " + req.method + " | " + req.url + " | " + `Ip: ${req.ip}\n`

    fs.appendFile("logs.txt", log, "utf-8", (err) => {
        if (err) console.log("Error while adding log")
    })

    next();
}

// if (cluster.isPrimary) {
//     console.log(`Primary process started: PID ${process.pid}`);
//     // Fork workers based on number of CPU cores
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }
// } else {
// console.log(`Worker process started: PID ${process.pid}`)\;

// import('./redisClient').then(async ({ default: redisClient }) => {
// await redisClient.connect();

export const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(requestLogs);
app.use(express.json());
app.use(cors({ origin: "*" }));
// app.use(globalLimiter); 
app.use('/', route);

connectDb();

// manage global error not handle from the async/wait code
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    const log = `${err}\n\n`

    fs.appendFile("error.txt", log, "utf-8", (err) => {
        if (err) console.log("Error while log the error")
    })
    process.exit(1); // exit to avoid inconsistent state
});

// manage global error not managed from the Promise or if Promise got rejected
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);

    const log = `Unhandled Rejection at: ${promise} reason ${reason}\n\n`

    fs.appendFile("error.txt", log, "utf-8", (err) => {
        if (err) console.log("Error while log the error")
    })

    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} [PID ${process.pid}]`);
});


// }).catch((err) => {
//     console.error('Failed to connect to Redis:', err);
// })
// }
