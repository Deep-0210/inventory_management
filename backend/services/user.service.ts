import { otpModel } from "../Models/otp.model";
import { userRegisterModel } from "../Models/user.model";
// import redisClient from "../redisClient";
import { validateEmail, validateUserCredentials } from "../Validation/ValidateCheckUserExist";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ForgetOTPTemplate } from "../View/ForgetOTP";
import { userMail } from "../services/mail.service";
import { validateRegisterUser } from "../Validation/ValidateUserRegisterData";
import { OtpType, UserCredentialsType, UserDataType, UserRegisterOtpType, UserServiceType } from "../types/user.types";
import { createProfile } from "../View/CreateProfile";

export const checkUserExistService = async (email: string): Promise<UserServiceType> => {
    try {

        const isEmailValidate = validateEmail({ email });

        if (isEmailValidate.error) {
            return { status: 400, message: isEmailValidate.error.details[0].message, data: null };
        }
        const checkUser = await userRegisterModel.findOne({ email: email });

        if (checkUser) {
            return { status: 200, message: "User Already Exist", data: null };
        }


        return { status: 200, message: "New User", data: null };
    }
    catch (error) {
        console.log(`Error in check user exist service: ${error}`)
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const userLoginService = async ({ email, password }: UserCredentialsType): Promise<UserServiceType> => {
    try {
        const validateCredentials = validateUserCredentials({ email, password });

        if (validateCredentials.error) {
            return { status: 400, message: validateCredentials.error.details[0].message, data: null };
        }

        const userData = await userRegisterModel.findOne({ "email": email }).exec();

        if (userData) {
            const validatePassword = await bcrypt.compare(password, userData.password);

            if (validatePassword) {
                const token = jwt.sign({ "email": userData.email }, `${process.env.JWT_SECRETE_KEY}`, { expiresIn: "10h" });
                // await redisClient.setEx(`user:${email}`, 60, token)\;
                return { status: 200, message: "LogIn successful", data: token };
            }
            else {
                return { status: 401, message: "Please check your email or password", data: null };
            }
        }

        return { status: 404, message: "User Not Found", data: null };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const generateForgetPasswordOtpService = async (email: string): Promise<UserServiceType> => {
    try {
        const validateData = validateEmail({ email: email });

        if (validateData.error) {
            return { status: 400, message: validateData.error.details[0].message, data: null }
        }

        const userData = await userRegisterModel.findOne({ "email": email }).exec();

        if (!userData) {
            return { status: 200, message: "User not found", data: null };
        }

        const userOtp = Math.floor(Math.random() * 1000000);

        const template: string = ForgetOTPTemplate(userOtp.toString(), userData?.firstName, userData?.lastName);
        // const mail = await userMail(email, "testuser02002@gmail.com", template, "OTP from Inventory Management");

        // if (!mail.response) {
        //     return { status: 500, message: "Fail to send OTP", data: null };
        // }

        await otpModel.create({
            email,
            otp: userOtp.toString(),
            otpType: "forgotOtp",
            createdAt: new Date()
        })

        // await otpModel.create({ email },
        //     {
        //         $set: { otp: userOtp.toString() },
        //         $setOnInsert: { otpType: "forgotOtp", createdAt: new Date() }
        //     },
        //     { new: true });
        return { status: 200, message: "OTP Generated Successfully", data: null };
    }
    catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const checkForgetPasswordOtpService = async ({ email, otp }: OtpType): Promise<UserServiceType> => {
    try {
        const isOtpExist = await otpModel.findOne({ "email": email, otpType: "forgotOtp" });

        if (!isOtpExist) {
            return { status: 404, message: "Otp Not Found", data: null };
        }

        const isOtpValid = isOtpExist.otp === otp;

        return { status: 200, message: isOtpValid ? "Correct OTP" : "Wrong Otp", data: null };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const updateUserPasswordService = async ({ email, password, otp }: UserCredentialsType & { otp: string }): Promise<UserServiceType> => {
    try {
        const validateUser = validateUserCredentials({ email, password });
        if (validateUser.error) {
            return { status: 400, message: validateUser.error.details[0].message, data: null };
        }

        const isUserExist = await userRegisterModel.findOne({ "email": email }).exec();
        if (!isUserExist) {
            return { status: 400, message: "User not exist", data: null };
        }

        const isOtpExist = await otpModel.findOne({ "email": email, otpType: "forgotOtp" });
        if (!isOtpExist) {
            return { status: 404, message: "Otp Not Found", data: null };
        }

        const isOtpValid = isOtpExist.otp === otp;

        if (!isOtpValid) {
            return { status: 400, message: "Wrong Otp", data: null };
        }

        const newPassword = await bcrypt.hash(password, 10);

        await userRegisterModel.findOneAndUpdate(isUserExist._id, { password: newPassword }, { new: true });
        return { status: 200, message: "Password Updated Successfully", data: null };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
};

export const getLoginUserDataService = async (email: string): Promise<UserServiceType> => {
    try {
        const userData = await userRegisterModel.findOne({ "email": email }).select({ password: 0, createdAt: 0, updatedAt: 0, __v: 0 });

        if (!userData) {
            return { status: 404, message: "User Not Found", data: null };
        }

        return { status: 200, message: "User Data", data: userData };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
};

export const registrationOtpService = async ({ email, firstName, lastName, country, role, city }: UserDataType): Promise<UserServiceType> => {
    try {
        const isUserDataValid = validateRegisterUser({ email, firstName, lastName, country, role, city });

        if (isUserDataValid.error) {
            return { status: 400, message: isUserDataValid.error.details?.[0].message, data: null };
        }

        const userRegistrationOtp = Math.floor(Math.random() * 1000000);

        const template = createProfile(userRegistrationOtp.toString(), firstName, lastName);
        const mail = await userMail(email, "testuser02002@gmail.com", template, "OTP from Inventory Management");

        if (!mail.response) {
            return { status: 500, message: "Fail to send Mail", data: null };
        }

        await otpModel.findOneAndUpdate({ email },
            {
                $set: { otp: userRegistrationOtp.toString() },
                $setOnInsert: { otpType: 'userRegisterOtp' }
            },
            { upsert: true, new: true }
        );

        return { status: 200, message: "OTP Generated", data: null };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
};

export const checkRegistrationOtpService = async ({ email, firstName, lastName, country, role, city, otp, password, userEmail }: UserRegisterOtpType): Promise<UserServiceType> => {
    try {
        const isUserDataValid = validateRegisterUser({ email, firstName, lastName, country, role, city });

        if (isUserDataValid.error) {
            return { status: 400, message: isUserDataValid.error.details?.[0].message, data: null };
        }

        const vendorData = await userRegisterModel.findOne({ "email": email });

        if (!vendorData) {
            return { status: 404, message: "Vendor not found", data: null };
        };

        const isOtpExist = await otpModel.findOne({ "email": email }).exec();

        if (!isOtpExist) {
            return { status: 400, message: "Otp not found", data: null };
        }

        const isCorrectOtp = otp === isOtpExist?.otp;

        if (!isCorrectOtp) {
            return { status: 400, message: "Wrong Otp", data: null };
        }

        const isNewUserExist = await userRegisterModel.findOne({ email: userEmail });

        if (isNewUserExist) {
            return { status: 400, message: "User already exist", data: null };
        }

        const newPassword = await bcrypt.hash(password, 10);

        const newUserData = new userRegisterModel({
            vendorRef: vendorData?._id,
            email: userEmail,
            firstName,
            lastName,
            country,
            role,
            city,
            password: newPassword
        });
        await newUserData.save();

        const token = jwt.sign({ "email": email }, `${process.env.JWT_SECRETE_KEY}`, { expiresIn: '10 hr' });
        return { status: 200, message: "User created successfully", data: token };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
};

export const updateUserDataService = async ({ email, firstName, lastName, country, role, city }: UserDataType): Promise<UserServiceType> => {
    try {
        const validateUserData = validateRegisterUser({ email, firstName, lastName, country, role, city });

        if (validateUserData.error) {
            return { status: 400, message: validateUserData.error.details[0].message, data: null };
        }

        const userData = await userRegisterModel.findOne({ email });

        if (!userData) {
            return { status: 404, message: "User not found", data: null };
        }

        const newRole = !userData.vendorRef || userData.vendorRef.toString() === userData._id.toString();

        const updatedUserData = await userRegisterModel.findByIdAndUpdate(userData._id,
            { email, firstName, lastName, country, role: newRole ? role : userData.role, city }, { new: true });
        return { status: 200, message: "User updated successfully", data: updatedUserData };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    };
};

export const deleteUserDataService = async ({ email, id }: { email: string, id: string }): Promise<UserServiceType> => {
    try {
        const userData = await userRegisterModel.findOne({ email });

        if (!userData) {
            return { status: 404, message: "User not found" };
        }

        const removeUSerData = await userRegisterModel.findOne({ "_id": id });

        if (!removeUSerData) {
            return { status: 404, message: "User not found" };
        }

        if (removeUSerData.vendorRef.toString() !== userData._id.toString()) {
            return { status: 403, message: "You are not authorized to delete this user", data: null };
        }

        await userRegisterModel.findByIdAndDelete(id);
        return { status: 200, message: "User removed successfully", data: null };
    } catch (error) {
        console.log(error)
        return { status: 500, message: "Internal Server Error555", data: error };
    }
}