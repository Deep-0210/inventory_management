import React, { useEffect, useState } from 'react'
import UserImage from '../Images/userImage.webp'
import { Button } from '@material-tailwind/react'
import { useNavigate, Link } from 'react-router-dom'
import { RootState } from '../../Types/Types'
import { useDispatch, useSelector } from 'react-redux'
import { getRequest } from '../../Service/Service'
import { logInUserAction } from '../../Store/Index'
import SignUp from '../UserSignUp/SignUp'
import RegisterUserData from '../UserRegistration/RegisterUserData'
import Message from '../TostMessage/Message'

const Header = () => {
  const navigate = useNavigate()

  // Function for log-out user
  const logOutUser = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const dispatch = useDispatch()

  const logInUserData = useSelector((state: RootState) => state.value[0])
  console.log({ logInUserData })

  const getLogInUserData = () => {
    getRequest('user/logInUserData')
      .then(res => {
        if (res.data) {
          dispatch(logInUserAction.logInUserData(res.data))
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  // useEffect to get logIn user data and store in store
  useEffect(() => {
    getLogInUserData()

  }, [])

  // Function to set value for open modal
  const [openModal, setOpenModal] = useState<number>(0)
  const openSignUpModal = () => {
    setOpenModal(1)
  }

  const [openRegisterDataModal, setOpenRegisterDataModal] = useState<number>(0)
  const openRegisterModal = () => {
    setOpenRegisterDataModal(2)
  }

  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Function to reset open modal value and send the success message
  const resetModalValue = (e: string | number) => {
    if (e === 'updated') {
      setSuccessMessage('Data Updated Successfully!!')
      getLogInUserData()
      setTimeout(() => {
        setSuccessMessage('')
        setOpenModal(0)
      }, 4500)
    }

    if (e === 'error') {
      setErrorMessage('Something Went Wrong!!')
      setTimeout(() => {
        setErrorMessage('')
        setOpenModal(0)
        setOpenRegisterDataModal(0)
      }, 4500)
    }

    setOpenRegisterDataModal(0)
  }

  return (
    <>
      <div className="bg-transparent h-max w-full text-white py-5 px-5 flex justify-between align-middle">
        <div className="flex justify-center items-center">
          <div className="text-xl pe-3 cursor-pointer">
            <Link to="/request-stock">Request Stock </Link>
          </div>

          {(logInUserData?.role === "superVendor" || logInUserData?.role === "adminVendor") && <div className="text-xl px-3 cursor-pointer">
            <Link to="/add-stock">Add Stock</Link>
          </div>}
          {(logInUserData?.role.includes('superVendor') ||
            logInUserData?.role.includes('adminVendor')) && (
              <div className="text-xl px-3 cursor-pointer">
                <Link to="/vendor-list">Vendor List</Link>
              </div>
            )}
        </div>

        <div className="flex">
          <div className="pe-3">
            <button onClick={openRegisterModal}>
              <img
                src={UserImage}
                alt="userImage"
                className="bg-white w-10 h-10 rounded-full p-2 cursor-pointer mx-auto"
              />
              <span className="text-sm">
                Welcome, {logInUserData?.firstName} {logInUserData?.lastName}
              </span>
            </button>
          </div>

          <div className="px-3">
            <Button placeholder={'log-out'} color="red" onClick={logOutUser}>
              Log-out
            </Button>
          </div>

          {(logInUserData?.role.includes('superVendor') ||
            logInUserData?.role.includes('adminVendor')) && (
              <div className="px-2">
                <Button
                  placeholder={'sign-up'}
                  color="green"
                  onClick={() => openSignUpModal()}
                >
                  Create-user
                </Button>
              </div>
            )}
        </div>
      </div>
      <SignUp openModal={openModal} resetModalValue={resetModalValue} />

      {(successMessage?.length > 0 || errorMessage?.length > 0) && (
        <Message
          successMessage={successMessage?.length ? successMessage : ''}
          errorMessage={errorMessage?.length ? errorMessage : ''}
        />
      )}

      <RegisterUserData
        userData={logInUserData}
        openModal={openRegisterDataModal}
        resetModalValue={resetModalValue}
      />
    </>
  )
}

export default Header
