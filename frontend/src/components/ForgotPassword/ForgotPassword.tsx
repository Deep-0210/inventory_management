import { Button } from '@material-tailwind/react'
import React, { useState } from 'react'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { postRequest, putRequest } from '../../Service/Service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {

    // Function to print error message in toastify
    const errorMessage = (data: string) => {
        toast.error(`${data}`, {
            position: 'bottom-left',
            autoClose: 3000
        });
    };

    // Function to print success message in toastify
    const successMessage = (data: string) => {
        toast.success(`${data}`, {
            position: 'bottom-left',
            autoClose: 3000
        });
    };

    // Validate email data
    const validateEmail = yup.object({
        userEmail: yup.string().required("* Email is a required field").matches(/^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]{2,5}$/, "* Invalid Email")
    });

    // Formic state to store email data
    const userEmail = useFormik({
        initialValues: { userEmail: "" },
        validationSchema: validateEmail,
        onSubmit: () => {
            submitUserEmail(userEmail.values.userEmail)
        }
    });

    // Function to submit user email data
    const [button, setButton] = useState(0)
    const [forgetPasswordDiv, setForgetPasswordDiv] = useState(0)
    const submitUserEmail = (data: string) => {
        setButton(1)
        const Data = JSON.stringify({
            email: data
        })

        postRequest("generateForgotPasswordOTP", Data).then((res) => {
            if (res.Message.includes("OTP Generated Successfully")) {
                successMessage("OTP Generated Successfully")
                setForgetPasswordDiv(1)
            }
            else if (res.Message.includes("User not found")) {
                errorMessage("User not exist");
                setButton(0)
            }
            else {
                setButton(0)
                errorMessage("Something Went Wrong");
            }
        }).catch((err) => {
            console.log(err)
            setButton(0)
            errorMessage("Something Went Wrong");
        })
    };

    const validateOtp = yup.object({
        otp: yup.string().required("* OTP is a required field").max(6, "OTP should be maximum 6 characters long")
    });

    const userOTP = useFormik({
        initialValues: { otp: "" },
        validationSchema: validateOtp,
        onSubmit: () => {
            submitUserOTP(userOTP.values.otp)
        }
    });

    // Function to submit user otp
    const submitUserOTP = (data: string) => {
        const Data = JSON.stringify({
            email: userEmail.values.userEmail,
            otp: data
        });

        postRequest("checkForgetPasswordOTP", Data).then((res) => {
            if (res.Message.includes("Correct OTP")) {
                setForgetPasswordDiv(3)
            }
            else if (res.Message.includes("Wrong OTP")) {
                errorMessage("Wrong OTP")
            }
            else {
                errorMessage("Something Went Wrong")
            }
        }).catch((err) => {
            console.log(err)
            errorMessage("Something Went Wrong")
        })
    };

    // Function to show and hide password
    const [passwdEye, setPasswdWye] = useState(0)
    const showHidePassword = () => {
        const val = document.getElementById('userPassword') as HTMLInputElement;

        if (passwdEye === 0 && val?.type === "password") {
            setPasswdWye(1)
            val.type = "text";
        }
        else {
            setPasswdWye(0)
            val.type = "password";
        }
    };

    // validate user entered password
    const validatePassword = yup.object({
        userPassword: yup.string().required('* Password is a required field').min(6, "Password must be 6 character long").matches(/[a-z]/, "* Password requires a lowercase letter").matches(/[A-Z]/, "* Password requires an uppercase letter").matches(/[\d]/, "* Password requires a number").matches(/[@#$%]/, "* Password required a special character")
    });

    const userPassword = useFormik({
        initialValues: { userPassword: "" },
        validationSchema: validatePassword,
        onSubmit: () => {
            submitUserPassword(userPassword.values.userPassword)
        }
    });


    // Function to submit user new password
    const submitUserPassword = (data: string) => {
        const Data = JSON.stringify({
            email: userEmail.values.userEmail,
            password: data
        });

        putRequest("updateUserPassword", Data).then((res) => {
            if (res.Message.includes("Password Updated Successfully")) {
                successMessage("Password Updated Successfully");
                setForgetPasswordDiv(0)
                setButton(0)
                userEmail.values.userEmail = ""
                userOTP.values.otp = ""
                userPassword.values.userPassword = ""
            }
            else {
                errorMessage("Something Went Wrong");
            }
        }).catch((err) => {
            console.log(err);
            errorMessage("Something Went Wrong");
        })
    };

    return (
        <div className='signUpCard w-full h-screen text-white'>
            <div className='pt-56'>
                {/* div to take a email input */}
                {forgetPasswordDiv === 0 ? <div className='w-[400px] h-max pb-5 border-2 border-white rounded-lg mx-auto'>
                    <form onSubmit={userEmail.handleSubmit}>
                        <div className='px-5 pt-5'>
                            <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Email</span></div>
                            <input type="email" name="userEmail" id="userEmail" value={userEmail.values.userEmail} className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='Email' onChange={userEmail.handleChange} onBlur={userEmail.handleBlur} />
                            <div className='text-red-700 font-semibold'><small>{userEmail.touched.userEmail && userEmail.errors.userEmail}</small></div>
                        </div>

                        <div className='mt-3 hover:text-blue-700 px-6 hover:cursor-pointer hover:underline'>
                            <Link to='/login'>Back to Log-In ?</Link>
                        </div>

                        <div className='mt-5 w-max mx-auto'>
                            {button === 1 ? <Button placeholder={'submit'} color="green" type='submit' disabled>submit</Button> : <Button color="green" placeholder={'submit'} type='submit'>submit</Button>}
                        </div>
                    </form>
                </div> : ""}

                {/* div to take otp input */}
                {forgetPasswordDiv === 1 ? <div className='w-[400px] h-max pb-5 border-2 border-white rounded-lg mx-auto'>
                    <form onSubmit={userOTP.handleSubmit}>
                        <div className='px-5 pt-5'>
                            <input type="text" name="otp" id="otp" value={userOTP.values.otp} className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='******' onChange={userOTP.handleChange} onBlur={userOTP.handleBlur} />
                            <div className='text-red-700 font-semibold'><small>{userOTP.touched.otp && userOTP.errors.otp}</small></div>
                        </div>

                        <div className='mt-5 w-max mx-auto'>
                            <Button placeholder={'submit'} color="green" type='submit'>submit</Button>
                        </div>
                    </form>
                </div> : ""}

                {forgetPasswordDiv === 3 ? <div className='w-[400px] h-max pb-5 border-2 border-white rounded-lg mx-auto'>
                    <form onSubmit={userPassword.handleSubmit}>
                        <div className='w-full mt-4 px-5 relative'>
                            <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Password</span></div>
                            {passwdEye === 0 ? <div className='absolute right-0 pe-10 text-black mt-2 hover:cursor-pointer'><VscEyeClosed onClick={showHidePassword} /></div>
                                :
                                <div className='absolute right-0 pe-10 text-black mt-2 hover:cursor-pointer'><VscEye onClick={showHidePassword} /></div>
                            }
                            <input type="password" name="userPassword" id="userPassword" value={userPassword.values.userPassword} className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='Password' onChange={userPassword.handleChange} onBlur={userPassword.handleBlur} />
                            <div className='text-red-700 font-semibold'><small>{userPassword.touched && userPassword.errors.userPassword}</small></div>
                        </div>

                        <div className='mt-5 w-max mx-auto'>
                            <Button placeholder={'submit'} color="green" type='submit'>submit</Button>
                        </div>
                    </form>
                </div> : ""}
            </div>
            <ToastContainer />
        </div>
    )
}
