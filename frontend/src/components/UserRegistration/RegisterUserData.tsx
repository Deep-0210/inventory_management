import React, { useEffect, useState } from 'react'
import address from './Address.json'
import { CityData, RegisterUser, UserSignUp } from '../../Types/Types';
import * as yup from 'yup'
import { useFormik } from 'formik';
import { Button } from "@material-tailwind/react";
import { postRequest } from '../../Service/Service';
import { useNavigate } from 'react-router-dom';

export default function RegisterUserData({ userData, userProfileData }: Readonly<{ userData: Array<UserSignUp>, userProfileData: Function }>) {

    const navigate = useNavigate()

    // Validation from yup
    const validateUserData = yup.object({
        firstName: yup.string().required("* First Name is a required field").matches(/^[a-zA-Z]+$/, "* First Name should be characters only"),
        lastName: yup.string().required("* Last Name is a required field").matches(/^[A-Za-z]+$/, "* Last Name should be characters only"),
        vendorRole: yup.string().required("* Role is a required field").notOneOf(['def'], 'Role is a required field'),
        userCountry: yup.string().required("* Country is a required field").notOneOf(['def'], 'Country is a required field'),
        userCity: yup.string().required("* City is a required field").notOneOf(['def'], 'City is a required field')
    });

    // Formic state for store data and validation
    const { values, touched, errors, handleBlur, handleSubmit, handleChange } = useFormik({
        initialValues: { firstName: "", lastName: "", vendorRole: "def", userCountry: "def", userCity: "" },
        validationSchema: validateUserData,
        onSubmit: (values: RegisterUser) => {
            submitUserData(values)
        }
    });

    // useEffect to get city data based in state data
    const [cityData, setCityData] = useState<Array<CityData>>([])
    useEffect(() => {
        const countryData = address.Country.find((d) => d.CountryName === values.userCountry);
        const city: any = address.Cities.filter((d) => d.CountryID === countryData?.CountryID);
        setCityData(city)
    }, [values.userCountry]);

    // Function to submit userData 
    const [button, setButton] = useState(0)
    const submitUserData = (data: RegisterUser) => {
        setButton(1)
        const Data = JSON.stringify({
            email: userData[0].email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.vendorRole,
            country: data.userCountry,
            city: data.userCity
        });

        postRequest("userRegistrationOTP", Data).then((res) => {
            // console.log(res)
            if (res.Message.includes("OTP Generated")) {
                userProfileData(values)
                navigate('/verify-otp')
            }
            else {
                setButton(0)
            }
        }).catch((err) => {
            console.log(err)
            setButton(0)
        })
    }

    // useEffect to check email is there or not
    useEffect(() => {
        if (!userData[0]?.email) {
            navigate('/')
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className='bg-[rgb(3,29,78)] h-[100%] w-full'>
            <div className='text-3xl font-semibold p-3.5 headingText'>Inventory Management System</div>

            <div className='pt-20 pb-10'>
                <div className='max-w-[400px] mx-auto rounded-lg pb-5 border-2 border-white' >
                    <form onSubmit={handleSubmit}>
                        {/* User first name div */}
                        <div className='w-full mt-5 px-5'>
                            <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>First Name *</span></div>
                            <input type="text" name="firstName" value={values.firstName} id="firstName" className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='First Name' onChange={handleChange} onBlur={handleBlur} />
                            <div className='text-red-700 font-semibold'><small>{touched.firstName && errors.firstName}</small></div>
                        </div>

                        {/* user last name div */}
                        <div className='w-full mt-5 px-5'>
                            <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Last Name *</span></div>
                            <input type="text" name="lastName" id="lastName" className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='Last Name' onChange={handleChange} onBlur={handleBlur} />
                            <div className='text-red-700 font-semibold'><small>{touched.lastName && errors.lastName}</small></div>
                        </div>

                        {/* vendor role selection */}
                        <div className='w-full mt-5 px-5'>
                            <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Role *</span></div>
                            <select name="vendorRole" id="vendorRole" className='w-full rounded-lg h-8 font-semibold' onChange={handleChange} onBlur={handleBlur}>
                                <option value="def">Select vendor role</option>
                                <option value="superVendor">superVendor</option>
                                <option value="adminVendor">adminVendor</option>
                                <option value="vendor">vendor</option>
                            </select>
                            <div className='text-red-700 font-semibold'><small>{touched.vendorRole && errors.vendorRole}</small></div>
                        </div>

                        {/* user select country div */}
                        <div className='w-full mt-5 px-5'>
                            <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Country *</span></div>
                            <select name="userCountry" id="userCountry" className='w-full rounded-lg h-8 font-semibold' onChange={handleChange} onBlur={handleBlur}>
                                <option value="def">Please Select</option>
                                {
                                    address.Country.map((e: any) => {
                                        return (
                                            <option value={e.CountryName} key={e.CountryID}>{e.CountryName}</option>
                                        )
                                    })
                                }
                            </select>
                            <div className='text-red-700 font-semibold'><small>{touched.userCountry && errors.userCountry}</small></div>
                        </div>

                        {/* user select city div */}
                        <div className='w-full mt-5 px-5'>
                            <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>City *</span></div>
                            <select name="userCity" id="userCity" className='w-full rounded-lg h-8 font-semibold' onChange={handleChange} onBlur={handleBlur}>
                                <option value="def">Please Select</option>
                                {
                                    cityData.map((e: any) => {
                                        return (
                                            <option value={e.Name} key={e.CityID}>{e.Name}</option>
                                        )
                                    })
                                }
                            </select>
                            <div className='text-red-700 font-semibold'><small>{touched.userCountry && errors.userCountry}</small></div>
                        </div>

                        {/* Button to submit data */}
                        <div className='mt-5 w-max mx-auto'>
                            {button === 1 ? <Button placeholder={'submit'} color="green" type='submit' disabled>submit</Button> : <Button placeholder={'submit'} color="green" type='submit'>submit</Button>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
