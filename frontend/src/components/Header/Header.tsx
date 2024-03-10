import React from 'react'
import UserImage from '../Images/userImage.webp'
import { Button } from '@material-tailwind/react'
import { useNavigate } from 'react-router-dom'

const Header = () => {

  const navigate = useNavigate()

  // Function for log-out user
  const logOutUser = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className='bg-black h-max w-full text-white py-5 px-5 flex justify-between align-middle'>
      <div className='flex justify-center items-center'>
        <div className='text-xl pe-3 cursor-pointer'>
          Available Stock
        </div>
        <div className='text-xl px-3 cursor-pointer'>
          Add Stock
        </div>
        <div className='text-xl px-3 cursor-pointer'>
          Vendor List
        </div>
      </div>

      <div className='flex'>
        <div className='pe-3'>
          <img src={UserImage} alt="" className='bg-white w-10 h-10 rounded-full p-2 cursor-pointer' />
        </div>

        <div className='ps-3'>
          <Button placeholder={'log-out'} color="red" onClick={logOutUser}>Log-out</Button>
        </div>
      </div>
    </div>
  )
}

export default Header
