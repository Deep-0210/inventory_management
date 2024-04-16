import React, { useEffect, useState } from 'react'
import PrintTable from './Table'
import Header from '../Header/Header'
import { Button } from '@material-tailwind/react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { EditStockData, UserStock } from '../../Types/Types'
import { useNavigate } from 'react-router-dom'
import { postRequest, putRequest } from '../../Service/Service'

const AddStock = () => {
    const navigate = useNavigate()

    // useEffect to check token if not then will redirect to logIn page
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token === '') {
            navigate('/')
        }
        //eslint-disable-next-line
    }, [])

    // validation schema for validate add schema data
    const validateAddStockData = yup.object({
        productName: yup.string().required("* Product Name is required field"),
        productQuantity: yup.string().required("* Product Quantity is required field"),
        productPrice: yup.string().required("* Product Price is required field")
    })

    // formik for store data 
    const { handleSubmit, handleBlur, handleChange, errors, touched, values, resetForm, setValues } = useFormik({
        initialValues: { productName: "", productQuantity: "", productPrice: "" },
        validationSchema: validateAddStockData,
        onSubmit: (values: UserStock) => {
            if (data.productName !== "") {
                updateStockData(values)
            }
            else {
                submitAddStock(values)
            }
        }
    })

    // Function for api call of addStock data
    const [reApiCall, setReApiCall] = useState<number>(0)
    const submitAddStock = (value: UserStock) => {
        console.log(value, 'value')
        postRequest('addStock', JSON.stringify(value)).then((res) => {
            console.log(res, 'res')
            setReApiCall(1)
            resetForm()
            setTimeout(() => {
                setReApiCall(0)
            }, 500)
        }).catch((err) => {
            console.log(err)
        })
    }

    const [data, setData] = useState<EditStockData>({ '_id': "", "productName": "", "productPrice": "", "productQuantity": "" })
    // useEffect for set the edit data
    useEffect(() => {
        if (data.productName !== "") {
            setValues(data)
            // console.log(data, 'dataInAddStock')
        }
        // eslint-disable-next-line
    }, [data.productName !== ""])

    // Function for update stock data
    const updateStockData = (value: UserStock) => {
        const stockData = {
            id: data._id,
            ...value
        }

        putRequest('updateStockData', JSON.stringify(stockData)).then((res) => {
            console.log(res, 'res')
            resetForm()
            setReApiCall(1)
            setData({ '_id': "", "productName": "", "productPrice": "", "productQuantity": "" })
            setTimeout(() => {
                setReApiCall(0)
            }, 500)
        }).catch((err) => console.log(err))
    }

    // Function for delete the stock data
    // const deleteStock = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     const id = (e.target as HTMLButtonElement)?.id

    //     deleteRequest('removeStockData', JSON.stringify({ "id": id })).then((res) => {
    //         console.log(res, 'res')
    //         setReApiCall(1)
    //         setTimeout(() => {
    //             setReApiCall(0)
    //         }, 500)
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // }

    // useEffect for the set bg height and width
    const [width, setWidth] = useState<number>(window.innerWidth)
    const [height, setHeight] = useState<number>(window.innerHeight)
    useEffect(() => {
        setHeight(window.innerHeight)
        setWidth(window.innerWidth)
        // eslint-disable-next-line
    }, [window.innerHeight, window.innerWidth]);

    return (
        <div className='signUpCard text-white overflow-y-scroll' style={{ height: height, width: width }}>
            <div>
                <Header />
            </div>

            <div className='w-[320px] border border-white rounded-lg mx-auto p-5 my-10'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div className='text-white my-1'>Product Name</div>
                        <input type="text" id='productName' name='productName' value={values.productName} className='w-full h-8 rounded-lg mx-auto placeholder:text-black placeholder:font-semibold text-black ps-2 border border-white' onChange={handleChange} onBlur={handleBlur} />
                        <div className='text-red-700 font-semibold'><small>{touched.productName && errors.productName}</small></div>
                    </div>

                    <div className='my-5'>
                        <div className='text-white my-1'>Product Quantity</div>
                        <input type="text" id='productQuantity' name='productQuantity' value={values.productQuantity} className="w-full h-8 border border-white rounded-lg mx-auto placeholder:text-black placeholder:font-semibold text-black ps-2" onBlur={handleBlur} onChange={handleChange} />
                        <div className='text-red-700 font-semibold'><small>{touched.productQuantity && errors.productQuantity}</small></div>
                    </div>

                    <div className='my-5'>
                        <div className='text-white my-1'>Product Price</div>
                        <input type="text" id='productPrice' name='productPrice' value={values.productPrice} className="w-full h-8 border border-white rounded-lg mx-auto placeholder:text-black placeholder:font-semibold text-black ps-2" onBlur={handleBlur} onChange={handleChange} />
                        <div className='text-red-700 font-semibold'><small>{touched.productPrice && errors.productPrice}</small></div>
                    </div>

                    <div className='mt-5 w-max mx-auto'>
                        <Button placeholder={'addStock'} color="green" type='submit'>{`${data.productName !== "" ? 'Update Stock' : '+ Add Stock'}`}</Button>
                    </div>
                </form>
            </div>

            <div>
                {/* <PrintTable endPoint='getStockData' deleteStock={deleteStock} reApiCall={reApiCall} /> */}
                <PrintTable endPoint='getStockData' reApiCall={reApiCall} setData={setData} />
            </div>
        </div>
    )
}

export default AddStock
