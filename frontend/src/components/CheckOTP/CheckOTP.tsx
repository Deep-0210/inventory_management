import React, { useEffect, useState } from 'react'
import { OTPCheck, RootState, UserRegistration } from '../../Types/Types'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { postRequest } from '../../Service/Service';
import { useSelector } from 'react-redux';
import { Button, Dialog, DialogHeader, DialogBody } from "@material-tailwind/react"
import Message from '../TostMessage/Message';

export default function CheckOTP({ openModal, registerData, resetModalValue }: { openModal: number, registerData: UserRegistration | undefined, resetModalValue: (e: string | number) => void }) {

    // Function to validate OTP
    const validateOTP = Yup.object({
        OTP: Yup.string().required("* Please enter OTP")
    })

    // function to manage formic state and check for validation
    const { values, errors, handleChange, handleBlur, handleSubmit, touched } = useFormik({
        initialValues: { OTP: "" },
        validationSchema: validateOTP,
        onSubmit: (values: OTPCheck) => {
            submitUserData(values)
        }
    })

    // useEffect to check user refresh page or not
    useEffect(() => {
        if (!registerData?.email) {
            resetModalValue(0)
        }

    }, [])

    // Function to submit userData
    const [wrongOTP, setWrongOTP] = useState(0)
    const submitUserData = (data: OTPCheck) => {
        const Data = JSON.stringify({
            otp: data.OTP,
            userEmail: registerData?.email,
            password: registerData?.password,
            firstName: registerData?.firstName,
            lastName: registerData?.lastName,
            country: registerData?.country,
            role: registerData?.role,
            city: registerData?.city
        })
        postRequest("checkRegistrationOTP", Data).then((res) => {
            if (res.Message.includes("Wrong OTP")) {
                setWrongOTP(1)
            }
            else {
                setWrongOTP(0)
                localStorage.setItem("token", res.Message)
                handleOpen()
                resetModalValue(0)
                setSuccessMessage("User Created Successfully!!")
                setTimeout(() => {
                    setSuccessMessage('')
                }, 5000)
            }
        }).catch((err) => {
            console.log(err)
            setErrorMessage("Something Went Wrong!!")
            setTimeout(() => {
                setErrorMessage('')
            }, 5000)
        })
    }

    const logInUserData = useSelector((state: RootState) => state.value[0])

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(!open);
        resetModalValue(0)
    }

    useEffect(() => {
        if (openModal === 3) {
            handleOpen()
        }

    }, [openModal])

    const [successMessage, setSuccessMessage] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')

    return (
        <>
            <Dialog placeholder={'mainModal'} open={open} handler={handleOpen} className='signUpCard text-white'>
                <DialogHeader placeholder={'title'} className='text-white'>Please enter OTP</DialogHeader>
                <DialogBody placeholder={'body'}>
                    <div className='signUpCard'>
                        <div className='my-10 border-2 border-white w-[400px] h-max pb-5 rounded-lg mx-auto'>
                            <form onSubmit={handleSubmit}>
                                <div className='text-white p-3 text-lg text-center'>We sent your registration code on <span className='font-semibold text-xl'>{logInUserData?.email && logInUserData?.email}</span> </div>
                                <div className='mt-5 px-5'>
                                    <input type="text" name="OTP" value={values.OTP} id="OTP" className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='OTP' onChange={handleChange} onBlur={handleBlur} />
                                    <div className='text-red-700 font-semibold'><small>{touched.OTP && errors.OTP}</small></div>
                                    {wrongOTP === 1 ? <div className='text-red-700 font-semibold'><small>* Wrong OTP</small></div> : ""}
                                </div>

                                <div className='mt-5 w-max mx-auto'>
                                    <Button placeholder={'submit'} color="green" type='submit'>submit</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </DialogBody>
            </Dialog>

            {(successMessage?.length > 0 || errorMessage?.length > 0) && <div>
                <Message successMessage={successMessage} errorMessage={errorMessage} />
            </div>}
        </>
    )
}
