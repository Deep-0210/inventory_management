import React, { useEffect, useState } from 'react'
import PrintTable from './Table'
import Header from '../Header/Header'

const AddStock = () => {
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
            <div>
                <Header />
            </div>

            <div>
                <PrintTable endPoint='getStockData' />
            </div>
        </div>
    )
}

export default AddStock
