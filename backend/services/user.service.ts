import { otpModel } from "../Models/otp.model";
import { User } from "../Models/user.model";
// import redisClient from "../redisClient";
import { validateEmail, validateUserCredentials } from "../Validation/ValidateCheckUserExist";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ForgetOTPTemplate } from "../View/ForgetOTP";
// import { userMail } from "../services/mail.service";
import { validateRegisterUser } from "../Validation/ValidateUserRegisterData";
import { OtpType, UserCredentialsType, UserDataType, UserRegisterOtpType, UserServiceType } from "../types/user.types";
import { userMail } from "./mail.service";
// import { createProfile } from "../View/CreateProfile";

export const checkUserExistService = async (email: string): Promise<UserServiceType<string | object>> => {
    try {

        const isEmailValidate = validateEmail({ email });

        if (isEmailValidate.error) {
            return { status: 400, message: isEmailValidate.error.details[0].message };
        }

        const checkUser = await User.findOne({ email });
        console.log({ checkUser })

        if (checkUser) {
            return { status: 200, message: "User Already Exist" };
        }

        return { status: 200, message: "New User" };
    }
    catch (error) {
        console.log(`Error in check user exist service: ${JSON.stringify(error, null, 2)}`)
        return { status: 500, message: "Internal Server Error", data: error ?? '' };
    }
}

export const userLoginService = async ({ email, password }: UserCredentialsType): Promise<UserServiceType<string | object>> => {
    try {
        const validateCredentials = validateUserCredentials({ email, password });

        if (validateCredentials.error) {
            return { status: 400, message: validateCredentials.error.details[0].message };
        }

        const userData = await User.findOne({ "email": email }).exec();

        if (userData) {
            const validatePassword = await bcrypt.compare(password, userData.password);

            if (validatePassword) {
                const token = jwt.sign({ "email": userData.email }, `${process.env.JWT_SECRETE_KEY}`, { expiresIn: "10h" });
                // await redisClient.setEx(`user:${email}`, 60, token)\;
                return { status: 200, message: "LogIn successful", data: token };
            }
            else {
                return { status: 401, message: "Please check your email or password", };
            }
        }

        return { status: 404, message: "User Not Found", };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error ?? '' };
    }
}

export const generateForgetPasswordOtpService = async (email: string): Promise<UserServiceType<string | object>> => {
    try {
        const validateData = validateEmail({ email: email });

        if (validateData.error) {
            return { status: 400, message: validateData.error.details[0].message, }
        }

        const userData = await User.findOne({ "email": email }).exec();

        if (!userData) {
            return { status: 200, message: "User not found", };
        }

        const userOtp = Math.floor(Math.random() * 1000000).toString();

        const template: string = ForgetOTPTemplate(userOtp.toString(), userData?.firstName, userData?.lastName);
        const mail = await userMail(email, "testuser02002@gmail.com", template, "OTP from Inventory Management");

        // await senEmail(userOtp, "Deep", "Patel", email, "OTP from Inventory Management")

        if (!mail.response) {
            return { status: 500, message: "Fail to send OTP", };
        }

        await otpModel.create({ email },
            {
                $set: { otp: userOtp.toString() },
                $setOnInsert: { otpType: "forgotOtp", createdAt: new Date() }
            },
            { new: true });
        return { status: 200, message: "OTP Generated Successfully", };
    }
    catch (error) {
        return { status: 500, message: "Internal Server Error", data: error ?? '' };
    }
}

export const checkForgetPasswordOtpService = async ({ email, otp }: OtpType): Promise<UserServiceType<string | object>> => {
    try {
        const isOtpExist = await otpModel.findOne({ "email": email, otpType: "forgotOtp" });

        if (!isOtpExist) {
            return { status: 404, message: "Otp Not Found", };
        }

        const isOtpValid = isOtpExist.otp === otp;

        return { status: 200, message: isOtpValid ? "Correct OTP" : "Wrong Otp", };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error ?? '' };
    }
}

export const updateUserPasswordService = async ({ email, password, otp }: UserCredentialsType & { otp: string }): Promise<UserServiceType<string | object>> => {
    try {
        const validateUser = validateUserCredentials({ email, password });
        if (validateUser.error) {
            return { status: 400, message: validateUser.error.details[0].message, };
        }

        const isUserExist = await User.findOne({ "email": email }).exec();
        if (!isUserExist) {
            return { status: 400, message: "User not exist", };
        }

        const isOtpExist = await otpModel.findOne({ "email": email, otpType: "forgotOtp" });
        if (!isOtpExist) {
            return { status: 404, message: "Otp Not Found", };
        }

        const isOtpValid = isOtpExist.otp === otp;

        if (!isOtpValid) {
            return { status: 400, message: "Wrong Otp", };
        }

        const newPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(isUserExist._id, { password: newPassword }, { new: true });
        return { status: 200, message: "Password Updated Successfully", };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error ?? '' };
    }
};

export const getLoginUserDataService = async (email: string): Promise<UserServiceType<typeof User | string | object>> => {
    try {
        const userData = await User.findOne({ "email": email }).select({ password: 0, createdAt: 0, updatedAt: 0, __v: 0 });

        if (!userData) {
            return { status: 404, message: "User Not Found", };
        }

        return { status: 200, message: "User Data", data: userData };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error ?? '' };
    }
};

export const registrationOtpService = async ({ email, firstName, lastName, country, role, city }: UserDataType): Promise<UserServiceType<string | object>> => {
    try {
        const isUserDataValid = validateRegisterUser({ email, firstName, lastName, country, role, city });

        if (isUserDataValid.error) {
            return { status: 400, message: isUserDataValid.error.details?.[0].message, };
        }

        const userRegistrationOtp = Math.floor(Math.random() * 1000000);

        // const template = createProfile(userRegistrationOtp.toString(), firstName, lastName);
        // const mail = await userMail(email, "testuser02002@gmail.com", template, "OTP from Inventory Management");

        // if (!mail.response) {
        //     return { status: 500, message: "Fail to send Mail", };
        // }

        await otpModel.findOneAndUpdate({ email },
            {
                $set: { otp: userRegistrationOtp.toString() },
                $setOnInsert: { otpType: 'userRegisterOtp' }
            },
            { upsert: true, new: true }
        );

        return { status: 200, message: "OTP Generated", };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error ?? '' };
    }
};

export const checkRegistrationOtpService = async ({ email, firstName, lastName, country, role, city, otp, password, userEmail }: UserRegisterOtpType): Promise<UserServiceType<string | object>> => {
    try {
        const isUserDataValid = validateRegisterUser({ email, firstName, lastName, country, role, city });

        if (isUserDataValid.error) {
            return { status: 400, message: isUserDataValid.error.details?.[0].message, };
        }

        const vendorData = await User.findOne({ "email": email });

        if (!vendorData) {
            return { status: 404, message: "Vendor not found", };
        };

        const isOtpExist = await otpModel.findOne({ "email": email }).exec();

        if (!isOtpExist) {
            return { status: 400, message: "Otp not found", };
        }

        const isCorrectOtp = otp === isOtpExist?.otp;

        if (!isCorrectOtp) {
            return { status: 400, message: "Wrong Otp", };
        }

        const isNewUserExist = await User.findOne({ email: userEmail });

        if (isNewUserExist) {
            return { status: 400, message: "User already exist", };
        }

        const newPassword = await bcrypt.hash(password, 10);

        const newUserData = new User({
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
        console.log(`Error in check-register-otp-service:${error}`)
        return { status: 500, message: "Internal Server Error", data: error ?? '' };
    }
};

export const updateUserDataService = async ({ email, firstName, lastName, country, role, city }: UserDataType): Promise<UserServiceType<typeof User | string | object>> => {
    try {
        const validateUserData = validateRegisterUser({ email, firstName, lastName, country, role, city });

        if (validateUserData.error) {
            return { status: 400, message: validateUserData.error.details[0].message, };
        }

        const userData = await User.findOne({ email });

        if (!userData) {
            return { status: 404, message: "User not found", };
        }

        const newRole = !userData.vendorRef || userData.vendorRef.toString() === userData._id.toString();

        const updatedUserData = await User.findByIdAndUpdate(userData._id,
            { email, firstName, lastName, country, role: newRole ? role : userData.role, city }, { new: true }) as typeof User;

        return { status: 200, message: "User updated successfully", data: updatedUserData };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error ?? '' };
    };
};

export const deleteUserDataService = async ({ email, id }: { email: string, id: string }): Promise<UserServiceType<string | object>> => {
    try {
        const userData = await User.findOne({ email });

        if (!userData) {
            return { status: 404, message: "User not found" };
        }

        const removeUSerData = await User.findOne({ "_id": id });

        if (!removeUSerData) {
            return { status: 404, message: "User not found" };
        }

        if (removeUSerData.vendorRef.toString() !== userData._id.toString()) {
            return { status: 403, message: "You are not authorized to delete this user", };
        }

        await User.findByIdAndDelete(id);
        return { status: 200, message: "User removed successfully", };
    } catch (error) {
        console.log(error)
        return { status: 500, message: "Internal Server Error555", data: error ?? '' };
    }
}