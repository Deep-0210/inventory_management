import React, { useEffect, useState } from 'react'
import UserImage from '../Images/userImage.webp'
import { Button } from '@material-tailwind/react'
import { useNavigate, Link } from 'react-router-dom'
import { RootState } from '../../Types/Types'
import { useDispatch, useSelector } from 'react-redux'
import { getRequest } from '../../Service/Service'
import { logInUserAction } from '../../Store/Index'
import SignUp from '../UserSignUp/SignUp'

const Header = () => {

  const navigate = useNavigate()

  // Function for log-out user
  const logOutUser = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const dispatch = useDispatch();

  const logInUserData = useSelector((state: RootState) => state.value[0])
  // console.log(logInUserData, 'logInUserData')

  // useEffect to get logIn user data and store in store
  useEffect(() => {
    getRequest("logInUserData").then((res) => {
      if (res.Message) {
        dispatch(logInUserAction.logInUserData(res.Message))
      }
    }).catch((err) => {
      console.log(err)
    });
    // eslint-disable-next-line
  }, [useSelector((state: RootState) => state.value).length === 0])

  // Function to set value for open modal
  const [openModal, setOpenModal] = useState<number>(0)
  const openSignUpModal = () => {
    setOpenModal(1)
  }

  // Function to reset open modal value
  const resetModalValue = () => {
    setOpenModal(0)
  }

  return (
    <div className='bg-transparent h-max w-full text-white py-5 px-5 flex justify-between align-middle'>
      <div className='flex justify-center items-center'>
        <div className='text-xl pe-3 cursor-pointer'>
          Available Stock
        </div>
        <div className='text-xl px-3 cursor-pointer'>
          <Link to='/add-stock'>Add Stock</Link>
        </div>
        <div className='text-xl px-3 cursor-pointer'>
          <Link to='/vendor-list'>Vendor List</Link>
        </div>
      </div>

      <div className='flex'>
        <div className='pe-3'>
          <img src={UserImage} alt="" className='bg-white w-10 h-10 rounded-full p-2 cursor-pointer' />
        </div>

        <div className='px-3'>
          <Button placeholder={'log-out'} color="red" onClick={logOutUser}>Log-out</Button>
        </div>

        {(logInUserData?.role.includes('superVendor') || logInUserData?.role.includes('adminVendor')) && <div className='px-2'>
          <Button placeholder={'sign-up'} color="green" onClick={() => openSignUpModal()}>Create-user</Button>
        </div>}
      </div>

      <SignUp openModal={openModal} resetModalValue={resetModalValue} />
    </div>
  )
}

export default Header
