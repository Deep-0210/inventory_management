import { Worker } from "worker_threads"

const workerData = new Worker("../SQS/sqs.config", {
    execArgv: ["-r", "ts-node/register"]
});

workerData.on("online", () => {
    console.log("Worker thread started...");
})

workerData.on("message", (msg) => {
    console.log(`Deleted messages from SQS:${msg}`)
})

workerData.on("error", (err) => {
    console.log(`Worker error:${err}`);
})

workerData.on("exit", (code) => {
    console.log(`Worker exited with code ${code}`);
});