import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, SendMessageCommand } from "@aws-sdk/client-sqs";
import { parentPort } from "worker_threads";


const client = new SQSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "",
        secretAccessKey: ""
    }
});

const queueUrl = "";


export const senEmail = async (otp: string, firstName: string, lastName: string, email: string, subject: string) => {
    const command = new SendMessageCommand({
        QueueUrl: "",
        MessageBody: JSON.stringify({
            otp,
            firstName,
            lastName,
            email,
            subject
        }),
        MessageGroupId: "inventory-otp",
        MessageDeduplicationId: new Date().getMilliseconds().toString()
    });

    await client.send(command)
}

let deletedMessages = 0;
export const pullSqs = async () => {

    try {
        const command = new ReceiveMessageCommand({
            QueueUrl: "",
            MaxNumberOfMessages: 5,
            WaitTimeSeconds: 5,
        });

        console.log("Worker: running task at", new Date().toLocaleTimeString());
        const response = await client.send(command);


        if (response.Messages && response.Messages.length > 0) {
            for (const msg of response.Messages) {
                console.log((msg))

                const isDeleted = await client.send(
                    new DeleteMessageCommand({
                        QueueUrl: queueUrl,
                        ReceiptHandle: msg.ReceiptHandle,
                    })
                );

                deletedMessages += 1;
                console.log({ isDeleted, deletedMessages })
            }
        }
    } catch (error) {
        console.error("Error polling SQS:", error);
    }
}

setInterval(pullSqs, 5000);

parentPort?.on("message", () => { });