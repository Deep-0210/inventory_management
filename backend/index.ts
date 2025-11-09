import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import route from './Routes';
// import os from 'node:os';
// import cluster from 'node:cluster';
import rateLimit from 'express-rate-limit';
import { connectDb } from './db/db.connect';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import fs from 'fs';
// import { logger, saveSuccessLogs } from './logs/logger';
import helmet from 'helmet';
import { AppError } from './types/error.type';
// import { pullSqs } from './SQS/sqs.config';

dotenv.config();

export const app = express();

const PORT = process.env.Server_Port || 3005;

const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, try again in a minute.',
});

// const numCPUs = os.cpus().length;

// if (cluster.isPrimary) {
//     console.log(`Primary process started: PID ${process.pid}`);
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }
// } else {
console.log(`Worker process started: PID ${process.pid}`);

// import('./redisClient').then(async ({ default: redisClient }) => {
// await redisClient.connect();

app.use(helmet())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(globalLimiter);
// app.use(saveSuccessLogs);
app.use('/', route);

connectDb();
// console.log(process.memoryUsage());

// pullSqs()

// Your custom error handler
// app.use((err: AppError, req: Request, res: Response) => {
//     // Log error using winston or your logger
//     logger.error({
//         message: err.message,
//         stack: err.stack,
//         url: req.originalUrl,
//         method: req.method,
//     });

//     res.status(500).json({ message: err.message });
// });

// Global process error handlers
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    const log = `${err}\n\n`;

    fs.appendFile("error.txt", log, "utf-8", (err) => {
        if (err) console.log("Error while logging the error");
    });
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    const log = `Unhandled Rejection at: ${promise} reason: ${reason}\n\n`;

    fs.appendFile("error.txt", log, "utf-8", (err) => {
        if (err) console.log("Error while logging the error");
    });
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} [PID ${process.pid}]`);
});

export default app;

// }).catch((err) => {
//     console.error('Failed to connect to Redis:', err);
// });
// }
