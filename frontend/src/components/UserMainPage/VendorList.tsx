import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Types/Types';
import { getRequest } from '../../Service/Service';
import { logInUserAction } from '../../Store/Index';
import PrintTable from './Table';

const VendorList = () => {
    const dispatch = useDispatch();

    // const logInUserData = useSelector((state: RootState) => state.value[0])

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
    }, [useSelector((state: RootState) => state.value).length === 0]);

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
            <div className=''>
                <PrintTable endPoint="getVendorList" />
            </div>
        </div>
    )
}

export default VendorList
