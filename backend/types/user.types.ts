export type UserServiceType<T> = {
    status: number
    message: string
    data?: T
};

export type UserCredentialsType = {
    email: string
    password: string
};

export type OtpType = {
    email: string
    otp: string
};

export type UserDataType = {
    email: string
    firstName: string
    lastName: string
    country: string
    role: string
    city: string
};

export type UserRegisterOtpType = UserDataType & {
    otp: string
    password: string
    userEmail: string
}

export type SendUser = {
    email: string,
    firstName: string
    lastName: string
    country: string
    city: string
    role: 'superVendor' | 'adminVendor' | 'vendor',
    password: string
}