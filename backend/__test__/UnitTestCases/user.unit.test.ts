import { Request, Response } from "express";
import { checkUserExist } from "../../Controller/user.controller";
import { User } from "../../Models/user.model";

jest.mock("../../Models/user.model")

describe("CHeck user exist controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();

        req = { body: {} } as Request,
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Partial<Response> as Response
    })

    test("return 200 if user exist", async () => {
        req.body.email = "deep485386@gmail.com";
        (User.findOne as jest.Mock).mockResolvedValue({ email: "deep485386@gmail.com" });

        await checkUserExist(req as Request, res as Response);

        expect(User.findOne).toHaveBeenCalledWith({ email: "deep485386@gmail.com" });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "User Already Exist",
            data: null
        })
    });

    test("return New user if user not exist", async () => {
        req.body.email = "deep4853861@gmail.com";
        (User.findOne as jest.Mock).mockResolvedValue(null);

        await checkUserExist(req as Request, res as Response);

        expect(User.findOne).toHaveBeenCalledWith({ email: "deep4853861@gmail.com" });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "New User",
            data: null
        })
    });

    test("check invalid email", async () => {
        req.body.email = "deep@gmail@.com";

        await checkUserExist(req as Request, res as Response);

        expect(User.findOne).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String)
            })
        );
    })

    test("Check valid email message and get use exist message", async () => {
        req.body.email = "deep485386@gmail.com";

        (User.findOne as jest.Mock).mockResolvedValue({ email: req.body.email });

        await checkUserExist(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "User Already Exist",
            data: null
        })
    })
})