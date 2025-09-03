import { Request, Response } from 'express'
import { checkForgetPasswordOtpService, checkRegistrationOtpService, checkUserExistService, deleteUserDataService, generateForgetPasswordOtpService, getLoginUserDataService, registrationOtpService, updateUserDataService, updateUserPasswordService, userLoginService } from '../services/user.service';
import { responseData, serverErrorMessage } from '../Utils/responseHandler';

export const checkUserExist = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const isUserExist = await checkUserExistService(email);

        return responseData(res, isUserExist.status, isUserExist.message, isUserExist.data);

    } catch (error) {
        return serverErrorMessage(res, { error });
    }
};

export const userLogIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userLogInData = await userLoginService({ email, password });

        return responseData(res, userLogInData.status, userLogInData.message, userLogInData.data);
    } catch (error) {
        return serverErrorMessage(res, { error });
    }
};

export const generateForgetPasswordOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const forgotPassword = await generateForgetPasswordOtpService(email);

        return responseData(res, forgotPassword.status, forgotPassword.message, forgotPassword.data);
    } catch (error) {
        return serverErrorMessage(res, { error });
    }
}

export const checkForgetPasswordOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const otpCheck = await checkForgetPasswordOtpService({ email, otp });
        return responseData(res, otpCheck.status, otpCheck.message, otpCheck.data);
    } catch (error) {
        return serverErrorMessage(res, { error });
    }
};

export const updateUserPassword = async (req: Request, res: Response) => {
    try {
        const { email, password, otp } = req.body;
        const isPasswordUpdated = await updateUserPasswordService({ email, password, otp });
        return responseData(res, isPasswordUpdated.status, isPasswordUpdated.message, isPasswordUpdated.data);
    } catch (error) {
        return serverErrorMessage(res, { error });
    }
};

export const logInUserData = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const userData = await getLoginUserDataService(email);
        return responseData(res, userData.status, userData.message, userData.data);
    } catch (error) {
        return serverErrorMessage(res, { error });
    }
};

export const registrationOtp = async (req: Request, res: Response) => {
    try {
        const { email, firstName, lastName, country, role, city } = req.body;
        const registrationOtp = await registrationOtpService({ email, firstName, lastName, country, role, city });

        return responseData(res, registrationOtp.status, registrationOtp.message, registrationOtp.data);
    } catch (error) {
        return serverErrorMessage(res, { error });
    }
}

export const checkRegistrationOtp = async (req: Request, res: Response) => {
    try {
        const { email, firstName, lastName, country, role, city, otp, password, userEmail } = req.body;
        const registrationOtp = await checkRegistrationOtpService({ email, firstName, lastName, country, role, city, otp, password, userEmail });

        return responseData(res, registrationOtp.status, registrationOtp.message, registrationOtp.data);
    } catch (error) {
        return serverErrorMessage(res, { error });
    }
};

export const updateUserData = async (req: Request, res: Response) => {
    try {
        const { email, firstName, lastName, country, role, city } = req.body;
        const updatedUserData = await updateUserDataService({ email, firstName, lastName, country, role, city });
        return responseData(res, updatedUserData.status, updatedUserData.message, updatedUserData.data);
    } catch (error) {
        return serverErrorMessage(res, { error });
    }
};

export const deleteUserData = async (req: Request, res: Response) => {
    try {
        const { email, id } = req.body;
        const isUserDataDeleted = await deleteUserDataService({ email, id });
        return responseData(res, isUserDataDeleted.status, isUserDataDeleted.message, isUserDataDeleted.data);
    } catch (error) {
        return serverErrorMessage(res, { error });
    }
}