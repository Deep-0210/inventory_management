import { Request, Response } from "express";
import { checkUserExist } from "../Controller/user.controller";
import { userRegisterModel } from "../Models/user.model";

jest.mock("../Models/user.model")

describe("CHeck user exist controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("return 200 if user exist", async () => {
        req = { body: { email: "deep485386@gmail.com" } } as Partial<Request> as Request,
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Partial<Response> as Response

        (userRegisterModel.findOne as jest.Mock).mockResolvedValue({ email: "deep485386@gmail.com" });

        await checkUserExist(req as Request, res as Response);

        expect(userRegisterModel.findOne).toHaveBeenCalledWith({ email: "deep485386@gmail.com" });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "User Already Exist",
            data: null
        })
        jest.clearAllMocks();
    });

    test("return New user if user not exist", async () => {

        req = { body: { email: "deep4853861@gmail.com" } } as Partial<Request> as Request,
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Partial<Response> as Response

        // (userRegisterModel.findOne as jest.Mock).mockResolvedValue({ email: "deep4853861@gmail.com" });
        (userRegisterModel.findOne as jest.Mock).mockResolvedValue(null);

        await checkUserExist(req as Request, res as Response);

        expect(userRegisterModel.findOne).toHaveBeenCalledWith({ email: "deep4853861@gmail.com" });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "New User",
            data: null
        })
        jest.clearAllMocks();
    })
})