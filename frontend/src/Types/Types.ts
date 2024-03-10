// Interface for the SignUp data type
export interface Data {
    userEmail: string,
    userPassword: string
}

// INterface for the city object data
export interface CityData {
    CityID: number,
    Name: string,
    CountryID: string
}

// Interface for thr sign-up user data
export interface UserSignUp {
    email: string,
    password: string
}

// Type Interface for registerUserData
export interface RegisterUser {
    firstName: string,
    lastName: string,
    vendorRole: string
    userCountry: string,
    userCity: string
};

// Interface for userProfile data
export interface UserProfileData {
    firstName: string,
    lastName: string
    userCountry: string
    userCity: string
    vendorRole: string
}

// Interface for otpCheck component
export interface OTPCheck {
    OTP: string
}