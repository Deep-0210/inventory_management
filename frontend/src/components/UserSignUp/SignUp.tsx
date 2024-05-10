import React, { useEffect, useState } from 'react'
import { postRequest } from '../../Service/Service';
import { VscEyeClosed, VscEye } from 'react-icons/vsc'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Data, UserSignUp } from '../../Types/Types';
import { Button, Dialog, DialogHeader, DialogBody } from "@material-tailwind/react"
import RegisterUserData from '../UserRegistration/RegisterUserData';

export default function SignUp({ openModal, resetModalValue }: { openModal: number, resetModalValue: Function }) {

    // Function to print error Message
    const errorMessage = (data: string) => {
        toast.error(`${data}`, {
            position: 'bottom-left',
            autoClose: 3000
        });
    }

    // Function to validate user data
    const validatePassword = Yup.object({
        userEmail: Yup.string().required('* Email is a required field').matches(/^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]{2,5}$/, "* Invalid Email"),
        userPassword: Yup.string().required('* Password is a required field').min(6, "Password must be 6 character long").matches(/[a-z]/, "* Password requires a lowercase letter").matches(/[A-Z]/, "* Password requires an uppercase letter").matches(/[\d]/, "* Password requires a number").matches(/[@#$%]/, "* Password required a special character")
    })

    // formic to set and user data and validate data
    const { values, errors, handleBlur, handleChange, handleSubmit, touched } = useFormik({
        initialValues: { userEmail: "", userPassword: "" },
        validationSchema: validatePassword,
        onSubmit: (values: any) => {
            signUpUser(values)
        }
    })


    // Function to send data of user and receive response
    const [openRegisterModal, setOpenRegisterModal] = useState<number>(0)
    const [userData, setUserData] = useState<UserSignUp>()
    const signUpUser = (data: Data) => {
        const newData = JSON.stringify({
            email: data.userEmail,
            password: data.userPassword
        });

        setUserData(JSON.parse(newData))
        postRequest("", newData).then((res) => {
            if (res.Message.includes("New User")) {
                setOpenRegisterModal(2)
                handleOpen()
            }
            else if (res.Message.includes("User Already Exist")) {
                errorMessage("User Already Exist");
            }
        }).catch((err) => {
            errorMessage("Something Went Wrong");
        })
    }

    // Function to show and hide password
    const [passwdEye, setPasswdEye] = useState(0)
    const showHidePassword = () => {
        const val = document.getElementById('userPassword') as HTMLInputElement;

        if (passwdEye === 0 && val?.type === "password") {
            setPasswdEye(1)
            val.type = "text";
        }
        else {
            setPasswdEye(0)
            val.type = "password";
        }
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(!open);
        resetModalValue(0)
    }

    useEffect(() => {
        if (openModal === 1) {
            handleOpen()
        }
        // eslint-disable-next-line
    }, [openModal])

    return (
        <>
            <Dialog placeholder={'mainModal'} open={open} handler={handleOpen} className='signUpCard text-white'>
                <DialogHeader placeholder={'title'} className='text-white'>Create-new User</DialogHeader>
                <DialogBody placeholder={'body'}>
                    <div>
                        <div className='w-[400px] mx-auto h-max pb-5 my-10 rounded-lg userCard border-2 border-white'>
                            <form onSubmit={handleSubmit}>

                                {/* div to take email input */}
                                <div className='w-full mt-5 px-5'>
                                    <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Email</span></div>
                                    <input type="email" name="userEmail" id="userEmail" value={values.userEmail} className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='Email' onChange={handleChange} onBlur={handleBlur} />
                                    <div className='text-sm text-red-700 font-semibold mt-1'>{touched.userEmail && errors.userEmail}</div>
                                </div>

                                {/* div for password input */}
                                <div className='w-full mt-4 px-5 relative'>
                                    <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Password</span></div>

                                    {passwdEye === 0 ?
                                        <div className='absolute right-0 pe-10 text-black pt-2.5 hover:cursor-pointer'><VscEyeClosed onClick={showHidePassword} /></div>
                                        :
                                        <div className='absolute right-0 pe-10 text-black pt-2.5 hover:cursor-pointer'><VscEye onClick={showHidePassword} /></div>}

                                    <input type="password" name="userPassword" value={values.userPassword} id="userPassword" className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='Password' onChange={handleChange} onBlur={handleBlur} />
                                    <div className='text-sm text-red-700 font-semibold mt-1'>{touched.userPassword && errors.userPassword}</div>
                                </div>

                                {/* div for submit button */}
                                <div className='mt-5 w-max mx-auto'>
                                    <Button placeholder={'signUp'} color="green" type='submit'>sign-up</Button>
                                </div>
                            </form>
                        </div>
                        <ToastContainer />
                    </div>
                </DialogBody>
            </Dialog>

            <RegisterUserData userData={userData} openModal={openRegisterModal} resetModalValue={resetModalValue} />
        </>
    )
}
