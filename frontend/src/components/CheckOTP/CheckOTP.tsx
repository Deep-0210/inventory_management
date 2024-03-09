import React, { useEffect, useState } from 'react'
import { OTPCheck, UserProfileData, UserSignUp } from '../../Types/Types'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Button } from "@material-tailwind/react";
import { postRequest } from '../../Service/Service';
import { useNavigate } from 'react-router-dom';

export default function CheckOTP({ ProfileData, userData }: { ProfileData: Array<UserProfileData>, userData: Array<UserSignUp> }) {

    const navigate = useNavigate()

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
        if (!userData[0]?.email) {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [])

    // Function to submit userData
    const [wrongOTP, setWrongOTP] = useState(0)
    const submitUserData = (data: OTPCheck) => {
        const Data = JSON.stringify({
            OTP: data.OTP,
            email: userData[0].email,
            password: userData[0].password,
            firstName: ProfileData[0].firstName,
            lastName: ProfileData[0].lastName,
            country: ProfileData[0].userCountry,
            city: ProfileData[0].userCity
        })
        postRequest("checkRegistrationOTP", Data).then((res) => {
            // console.log(res)
            if (res.Message.includes("Wrong OTP")) {
                setWrongOTP(1)
            }
            else {
                setWrongOTP(0)
                localStorage.setItem("token", res.Message)
                navigate('/user-page')
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div className='signUpCard h-screen w-screen'>
            <div className='flex justify-between'>
                <div className='text-3xl font-semibold p-3.5 headingText'>Candidate Hiring Portal</div>
            </div>
            <div className='mt-56 border-2 border-white w-[400px] h-max pb-5 rounded-lg mx-auto'>
                <form onSubmit={handleSubmit}>
                    <div className='text-white p-3 text-lg text-center'>We sent your registration code on <span className='font-semibold text-xl'>{userData[0]?.email}</span> </div>
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
    )
}
