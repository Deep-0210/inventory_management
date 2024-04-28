import React from "react"

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
    password?: string
}

// Type Interface for registerUserData
export interface RegisterUser {
    firstName: string,
    lastName: string,
    vendorRole: string
    userCountry: string,
    userCity: string,
    email?: string
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

// Interface for login user data
export interface LogInUserData {
    city: string,
    country: string,
    createdAt: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string
    updatedAt: string
    __v: number
    _id: string,
}

export type RootState = {
    value: LogInUserData[]
}

// Interface for vendorList array
export interface VendorListArray {
    city: string,
    country: string,
    createdAt: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string
    updatedAt: string
    vendorRef: string
    __v: number
    _id: string,
}

// Interface for user registration data
export interface UserRegistration {
    email: string
    password: string
    firstName: string
    lastName: string
    role: string
    country: string
    city: string
    _id?: string
}

// Interface for addStockData
export interface UserStock {
    productName: string
    productQuantity: string
    productPrice: string
}

// Interface for editStock data
export interface EditStockData {
    _id: string
    productName: string
    productQuantity: string
    productPrice: string
    update: boolean
    delete: boolean
}

// Interface for types of confirmation modal
export interface ConfirmationModalTypes {
    openConfirmationModal: number
    resetConfirmationModal: Function
    deleteEndPoint: string
    id: string
    title: string
    message: string
}

// Interface for print-table
export interface TableTypes {
    endPoint: string,
    reApiCall: number,
    setData: React.Dispatch<React.SetStateAction<any>>,
} 