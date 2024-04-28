import React, { useEffect, useState } from 'react'
import address from './Address.json'
import { CityData, RegisterUser, RootState, UserRegistration, UserSignUp } from '../../Types/Types';
import * as yup from 'yup'
import { useFormik } from 'formik';
import { postRequest, putRequest } from '../../Service/Service';
import { useSelector } from 'react-redux';
import { Button, Dialog, DialogHeader, DialogBody } from "@material-tailwind/react"
import CheckOTP from '../CheckOTP/CheckOTP';

export default function RegisterUserData({ userData, openModal, resetModalValue }: Readonly<{ userData: UserSignUp | undefined | UserRegistration, openModal: number, resetModalValue: Function }>) {

    const logInUserData = useSelector((state: RootState) => state.value[0])

    // Validation from yup
    const validateUserData = yup.object({
        firstName: yup.string().required("* First Name is a required field").matches(/^[a-zA-Z]+$/, "* First Name should be characters only"),
        lastName: yup.string().required("* Last Name is a required field").matches(/^[A-Za-z]+$/, "* Last Name should be characters only"),
        vendorRole: yup.string().required("* Role is a required field").notOneOf(['def'], 'Role is a required field'),
        userCountry: yup.string().required("* Country is a required field").notOneOf(['def'], 'Country is a required field'),
        userCity: yup.string().required("* City is a required field").notOneOf(['def'], 'City is a required field')
    });

    // validation schema for update user-data
    const validateUpdateUserData = yup.object({
        firstName: yup.string().required("* First Name is a required field").matches(/^[a-zA-Z]+$/, "* First Name should be characters only"),
        lastName: yup.string().required("* Last Name is a required field").matches(/^[A-Za-z]+$/, "* Last Name should be characters only"),
        vendorRole: yup.string().required("* Role is a required field").notOneOf(['def'], 'Role is a required field'),
        userCountry: yup.string().required("* Country is a required field").notOneOf(['def'], 'Country is a required field'),
        userCity: yup.string().required("* City is a required field").notOneOf(['def'], 'City is a required field'),
        email: yup.string().required("Email is a required field").matches(/^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]{2,5}$/, "* Invalid Email")
    });

    // Formic state for store data and validation
    const { values, touched, errors, handleBlur, handleSubmit, handleChange, setValues } = useFormik({
        initialValues: { firstName: "", lastName: "", vendorRole: "def", userCountry: "def", userCity: "", email: "" },
        validationSchema: userData && 'role' in userData && userData?.role?.length > 0 ? validateUpdateUserData : validateUserData,
        onSubmit: (values) => {
            if (userData && 'role' in userData && userData?.role?.length > 0 && updateUser === 1) {
                updateUserData(values)
            }
            if (updateUser === 0) {
                submitUserData(values)
            }
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
    const [openCheckOTPModal, setOpenCheckOTPModal] = useState<number>(0)
    const [registerData, setRegisterData] = useState<UserRegistration>()
    const [button, setButton] = useState(0)
    const submitUserData = (data: RegisterUser) => {
        setButton(1)
        const Data = JSON.stringify({
            email: userData?.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.vendorRole,
            country: data.userCountry,
            city: data.userCity
        });
        setRegisterData({
            email: userData?.email as string,
            password: userData?.password as string,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.vendorRole,
            country: data.userCountry,
            city: data.userCity
        })

        postRequest("userRegistrationOTP", Data).then((res) => {
            if (res.Message.includes("OTP Generated")) {
                setOpenCheckOTPModal(3)
                handleOpen()
            }
            else {
                setButton(0)
            }
        }).catch((err) => {
            console.log(err)
            setButton(0)
        })
    }

    // Function for api call to update user data
    const updateUserData = (data: RegisterUser) => {
        if (userData && 'role' in userData && userData?.role?.length > 0 && updateUser === 1) {
            const updatedData = {
                id: userData?._id,
                userEmail: data?.email,
                firstName: data?.firstName,
                lastName: data?.lastName,
                country: data?.userCountry,
                role: data?.vendorRole,
                city: data?.userCity
            }

            putRequest('updateUserData', JSON.stringify(updatedData)).then((res) => {
                if (res?.message?.includes('userData updated successfully')) {
                    resetModalValue('updated')
                    setUpdateUser(0)
                    setOpen(false)
                }
            }).catch((err) => {
                console.log(err)
                resetModalValue('error')
            })
        }
    }

    // useEffect to check email is there or not
    useEffect(() => {
        if (!userData?.email) {
            // navigate('/user-page')
            resetModalValue(0)
        }
        // eslint-disable-next-line
    }, [])

    // useEffect to set the data for update user data
    const [updateUser, setUpdateUser] = useState<number>(0)
    useEffect(() => {
        if (userData && 'role' in userData && userData?.role?.length > 0) {
            setUpdateUser(1)
            const updateUserData = {
                email: userData?.email,
                firstName: userData?.firstName,
                lastName: userData?.lastName,
                vendorRole: userData?.role,
                userCountry: userData?.country,
                userCity: userData?.city
            }
            setValues(updateUserData)
        }
    }, [userData])

    // Function and state for open and close modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
        resetModalValue(0)
    }

    /**
     * useEffect to open modal when 
     * @openModal variable will update
     */
    useEffect(() => {
        if (openModal === 2) {
            handleOpen()
        }
        // eslint-disable-next-line
    }, [openModal])

    return (
        <>
            <Dialog placeholder={'mainModal'} open={open} handler={handleOpen} className='signUpCard text-white'>
                <DialogHeader placeholder={'title'} className='text-white'>Add user information</DialogHeader>
                <DialogBody placeholder={'body'}>
                    <div className='bg-[rgb(3,29,78)]'>
                        <div className='my-10'>
                            <div className='max-w-[400px] mx-auto rounded-lg pb-5 border-2 border-white' >
                                <form onSubmit={handleSubmit}>

                                    {/* div for email when we have to update user-data */}
                                    {updateUser === 1 && <div className='w-full mt-5 px-5'>
                                        <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Email *</span></div>
                                        <input type="email" name="email" value={values?.email} id="email" className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='First Name' onChange={handleChange} onBlur={handleBlur} />
                                        <div className='text-red-700 font-semibold'><small>{touched.email && errors.email}</small></div>
                                    </div>}

                                    {/* User first name div */}
                                    <div className='w-full mt-5 px-5'>
                                        <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>First Name *</span></div>
                                        <input type="text" name="firstName" value={values?.firstName} id="firstName" className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='First Name' onChange={handleChange} onBlur={handleBlur} />
                                        <div className='text-red-700 font-semibold'><small>{touched.firstName && errors.firstName}</small></div>
                                    </div>

                                    {/* user last name div */}
                                    <div className='w-full mt-5 px-5'>
                                        <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Last Name *</span></div>
                                        <input type="text" name="lastName" id="lastName" className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='Last Name' value={values?.lastName} onChange={handleChange} onBlur={handleBlur} />
                                        <div className='text-red-700 font-semibold'><small>{touched.lastName && errors.lastName}</small></div>
                                    </div>

                                    {/* vendor role selection */}
                                    <div className='w-full mt-5 px-5'>
                                        <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Role *</span></div>
                                        <select name="vendorRole" id="vendorRole" className='w-full rounded-lg h-8 font-semibold' value={values?.vendorRole} onChange={handleChange} onBlur={handleBlur}>
                                            <option value="def">Select vendor role</option>
                                            {logInUserData?.role === 'superVendor' && <option value="superVendor">superVendor</option>}
                                            {((logInUserData?.role === 'adminVendor') || (logInUserData?.role === 'superVendor')) && <option value="adminVendor">adminVendor</option>}
                                            <option value="vendor">vendor</option>
                                        </select>
                                        <div className='text-red-700 font-semibold'><small>{touched.vendorRole && errors.vendorRole}</small></div>
                                    </div>

                                    {/* user select country div */}
                                    <div className='w-full mt-5 px-5'>
                                        <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Country *</span></div>
                                        <select name="userCountry" id="userCountry" className='w-full rounded-lg h-8 font-semibold' value={values?.userCountry} onChange={handleChange} onBlur={handleBlur}>
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
                                        <select name="userCity" id="userCity" className='w-full rounded-lg h-8 font-semibold' value={values?.userCity} onChange={handleChange} onBlur={handleBlur}>
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
                </DialogBody>
            </Dialog>
            <CheckOTP openModal={openCheckOTPModal} registerData={registerData} resetModalValue={resetModalValue} />
        </>
    )
}
