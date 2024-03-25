import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'

const UserMainPage = () => {

  // useEffect for the set bg height and width
  const [width, setWidth] = useState<number>(window.innerWidth)
  const [height, setHeight] = useState<number>(window.innerHeight)
  useEffect(() => {
    setHeight(window.innerHeight)
    setWidth(window.innerWidth)
    // eslint-disable-next-line
  }, [window.innerHeight, window.innerWidth])


  return (
    <div className='signUpCard' style={{ height: height, width: width }}>
      <div>
        <Header />
      </div>
      <div>
        Page after successful registration
      </div>
    </div>
  )
}

export default UserMainPage
