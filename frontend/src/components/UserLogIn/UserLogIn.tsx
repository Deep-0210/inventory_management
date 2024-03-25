import React, { useEffect, useState } from 'react'
import { Button } from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup'
import { useFormik } from 'formik';
import { postRequest } from '../../Service/Service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VscEyeClosed, VscEye } from 'react-icons/vsc'

export default function LogIn() {

  const navigate = useNavigate()

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

  // Function to print message in toastify
  const errorMessage = (data: string) => {
    toast.error(`${data}`, {
      className: "login-toast",
      //   position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 3000
    });
  };

  // Interface of logIn data
  interface LogIn {
    userEmail: string,
    userPassword: string
  };

  // Function to validate user data
  const validateLogInData = yup.object({
    userEmail: yup.string().required("* Email is a required field").matches(/^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]{2,5}$/, "* Invalid Email"),
    userPassword: yup.string().required("* Password is a required field").min(6, "* Password must be 6 characters long")
  });

  // Function to access formic for validation
  const { values, errors, handleBlur, handleChange, handleSubmit, touched } = useFormik({
    initialValues: { userEmail: "", userPassword: "" },
    validationSchema: validateLogInData,
    onSubmit: (values: LogIn) => {
      submitLogInData(values)
    }
  });

  // Function to submit userData
  const submitLogInData = (values: LogIn) => {
    const data = JSON.stringify({
      email: values.userEmail,
      password: values.userPassword
    });

    postRequest("userLogIn", data).then((res) => {
      responseMessage(res)
    }).catch((err) => {
      errorMessage("Something went Wrong")
    });
  }

  // Function to print error message
  const responseMessage = (err: any) => {
    if (err.Message.includes("Please check your email or password")) {
      errorMessage("Invalid Credentials")
    }
    else if (err.Message.includes("User Not Found")) {
      errorMessage("User Not Found")
    }
    else {
      localStorage.setItem("token", err.Message)
      navigate('/user-page')
    }
  }

  // useEffect for the set bg height and width
  const [width, setWidth] = useState<number>(window.innerWidth)
  const [height, setHeight] = useState<number>(window.innerHeight)
  useEffect(() => {
    setHeight(window.innerHeight)
    setWidth(window.innerWidth)
    // eslint-disable-next-line
  }, [window.innerHeight, window.innerWidth])

  return (
    <div className='signUpCard text-white' style={{ height: height, width: width }}>
      <div className='flex justify-between'>
        <div className='text-3xl font-semibold p-3.5 headingText'>Inventory Management Portal</div>
        <div>
          <div className='flex'>
            {/* <div className='pt-3 px-2'>
              <Button placeholder={'sign-up'} color="green"><Link to='/'>sign-up</Link></Button>
            </div> */}
          </div>
        </div>
      </div>


      <div className='w-[400px] mx-auto h-max pb-5 mt-32 rounded-lg userCard border-2 border-white'>
        <form onSubmit={handleSubmit}>
          {/* div to take email input from user */}
          <div className='w-full mt-5 px-5'>
            <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Email</span></div>
            <input type="email" name="userEmail" id="userEmail" value={values.userEmail} className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='Email' onChange={handleChange} onBlur={handleBlur} />
            <div className='text-red-700 font-semibold'><small>{touched.userEmail && errors.userEmail}</small></div>
          </div>

          {/* div to take password input from user */}
          <div className='w-full mt-4 px-5 relative'>
            <div className='text-white font-semibold text-xs pb-1 ps-0.5'><span>Password</span></div>
            {passwdEye === 0 ? <div className='absolute right-0 pe-10 text-black mt-2 hover:cursor-pointer'><VscEyeClosed onClick={showHidePassword} /></div>
              :
              <div className='absolute right-0 pe-10 text-black mt-2 hover:cursor-pointer'><VscEye onClick={showHidePassword} /></div>
            }
            <input type="password" name="userPassword" id="userPassword" value={values.userPassword} className='rounded-lg px-2 bg-white h-8 w-full placeholder:text-black placeholder:font-semibold text-black' placeholder='Password' onChange={handleChange} onBlur={handleBlur} />
            <div className='text-red-700 font-semibold'><small>{touched.userPassword && errors.userPassword}</small></div>
          </div>

          <div className='mt-5 hover:text-blue-700 px-6 hover:cursor-pointer hover:underline'>
            <Link to='/forget-password'>Forgot Password ?</Link>
          </div>

          {/* log-in button */}
          <div className='mt-5 w-max mx-auto'>
            <Button placeholder={'logIn'} color="green" type='submit'>log-in</Button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  )
}
