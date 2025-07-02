import { Request, Response } from 'express'
import { userRegisterModel } from '../Models/user.model';
import { validateSignUpUser } from '../Validation/ValidateCheckUserExist';

export const checkUserExist = async (req: Request, res: Response) => {
    console.log(req.body, typeof req.body)
    try {
        const checkUser = await userRegisterModel.findOne({ "email": req.body.email }).exec();


        if (checkUser) {
            res.status(200).json({ "Message": "User Already Exist" });
        }
        else {

            const validateConstrain = validateSignUpUser(req.body);

            if (validateConstrain.error) {
                res.status(200).json({ "Message": validateConstrain.error.details[0].message });
            }
            else {
                res.status(200).json({ "Message": "New User" });
            }
        }
    } catch (error) {
        res.status(500).json({ "Message": "Something Went Wrong!!" });
    }
};