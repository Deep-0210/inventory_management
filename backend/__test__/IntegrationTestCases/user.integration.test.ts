import request from "supertest";
import { app } from "../..";

describe("User API integration tests", () => {
    test("should return 200 if user exist", async () => {
        const res = await request(app).post("/user").send({ email: "deep485386@gmail.com" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("User Already Exist");
    });

    test("should return new user if not exist", async () => {
        const res = await request(app).post("/user").send({ email: "deep4853861@gmail.com" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("New User");
    });

    test("invalid email test", async () => {
        const res = await request(app).post("/user").send({ email: "deep@gmail@.com" });

        expect(res.status).toBe(400);
        expect(typeof res.body.message).toBe("string");
    })
})