import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import PrintTable from '../UserMainPage/Table'
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from '@material-tailwind/react'
import { getRequest, postRequest, putRequest } from '../../Service/Service'
import Message from '../TostMessage/Message'
import { RootState, StockRequest } from '../../Types/Types'
import { useSelector } from 'react-redux'

export default function GetAvailableStock() {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(!open)

  // useEffect for the set bg height and width
  const [width, setWidth] = useState<number>(window.innerWidth)
  const [height, setHeight] = useState<number>(window.innerHeight)
  useEffect(() => {
    setHeight(window.innerHeight)
    setWidth(window.innerWidth)
    // eslint-disable-next-line
  }, [window.innerHeight, window.innerWidth])

  const [data, setData] = useState({
    productName: '',
    productQuantity: '',
    productPrice: ''
  })

  // useEffect for set stock data in modal
  useEffect(() => {
    if (data && 'productName' in data && data?.productName !== '') {
      setOpen(true)
    }
  }, [data])

  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [disableButton, setDisableButton] = useState<boolean>(false)

  // api call for send stock request
  const sendStockRequest = () => {
    setDisableButton(true)
    postRequest('sendRequestMail', JSON.stringify(data))
      .then(res => {
        if (res.message === 'Request Send Successfully!!') {
          setSuccessMessage('Request Sent Successfully !!')
          setDisableButton(false)
          setOpen(false)
          setTimeout(() => {
            setSuccessMessage('')
          }, 500)
        }
      })
      .catch(err => {
        console.log(err)
        setErrorMessage('Something Went Wrong !!')
        setDisableButton(false)
        setTimeout(() => {
          setErrorMessage('')
        }, 500)
      })
  }

  const [manageRequest, setManageRequest] = useState<StockRequest>()
  const [reApiCall, setReApiCall] = useState<number>(0)

  useEffect(() => {
    if (manageRequest && "productName" in manageRequest && manageRequest?.productName !== "") {
      putRequest('answerRequestedStock', JSON.stringify({ id: manageRequest?._id, status: manageRequest?.status })).then((res) => {
        console.log(res)
        if (res?.message === "Request Updated Successfully!!") {
          setReApiCall(1)
          setSuccessMessage("Request Updated Successfully !!")
          setTimeout(() => {
            setReApiCall(0)
            setSuccessMessage("")
          }, 500)
        }
        else {
          setErrorMessage("Something Went Wrong !!")
          setTimeout(() => {
            setErrorMessage("")
          }, 500)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
    setManageRequest(manageRequest)
  }, [manageRequest])

  const logInUserData = useSelector((state: RootState) => state.value[0])

  return (
    <div
      className="signUpCard text-white overflow-y-scroll"
      style={{ height: height, width: width }}
    >
      <div>
        <Header />
      </div>

      <div>
        <div className="my-4 text-xl font-semibold">Stock Data: </div>
        <PrintTable
          endPoint="getUserStock"
          reApiCall={reApiCall}
          setData={setData}
          controllers={['request']}
        />
      </div>

      <div>
        <Dialog
          open={open}
          handler={handleOpen}
          size="md"
          placeholder={'requestModal'}
          className="signUpCard text-white"
        >
          <DialogHeader placeholder={'modalTitle'} className="text-white">
            Are you sure want to send request for {data?.productName} ?
          </DialogHeader>
          <DialogBody placeholder={'ModalBody'} className="w-max mx-auto">
            <div className="border border-white p-4 rounded-lg">
              {/* div for product name */}
              <div className="m-5 ms-0 mt-0">
                <div className="text-white my-1">Product Name</div>
                <div>
                  <input
                    type="text"
                    name="productName"
                    id="productName"
                    value={data?.productName}
                    className="h-8 rounded-lg mx-auto placeholder:text-black placeholder:font-semibold text-black ps-2 border border-white bg-white cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              {/* div for product Quantity */}
              <div className="m-5 ms-0">
                <div className="text-white my-1">Product Quantity</div>
                <div>
                  <input
                    type="text"
                    name="productName"
                    id="productName"
                    value={data?.productQuantity}
                    className="h-8 rounded-lg mx-auto placeholder:text-black placeholder:font-semibold text-black ps-2 border border-white bg-white"
                    onChange={e => {
                      setData(prev => ({
                        ...prev,
                        productQuantity: e.target.value
                      }))
                    }}
                  />
                </div>
              </div>

              {/* div for product price */}
              <div className="m-5 ms-0 mb-3">
                <div className="text-white my-1">Product Price</div>
                <div>
                  <input
                    type="text"
                    name="productName"
                    id="productName"
                    value={data?.productPrice}
                    className="h-8 rounded-lg mx-auto placeholder:text-black placeholder:font-semibold text-black ps-2 border border-white bg-white cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter placeholder={'modalFooter'}>
            <Button
              placeholder={'cancelButton'}
              variant="gradient"
              color="red"
              onClick={handleOpen}
              className="mx-4"
              disabled={disableButton}
            >
              <span>Cancel</span>
            </Button>
            <Button
              placeholder={'confirmButton'}
              variant="gradient"
              color="green"
              onClick={sendStockRequest}
              disabled={disableButton}
            >
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>

      <Message successMessage={successMessage} errorMessage={errorMessage} />

      {logInUserData?.role !== "vendor" && <div className="mt-20">
        <div className="my-4 text-xl font-semibold">Requested Stock Data: </div>
        <PrintTable
          endPoint="getPendingStockRequestedData"
          reApiCall={reApiCall}
          setData={setManageRequest}
          controllers={['Accept', 'Reject']}
        />
      </div>}


      {logInUserData?.role !== "vendor" && <div className="mt-20">
        <div className="my-4 text-xl font-semibold">Responded Stock Data: </div>
        <PrintTable
          endPoint="getRespondedStockRequestedData"
          reApiCall={reApiCall}
          setData={setManageRequest}
          controllers={[]}
        />
      </div>}

      {(logInUserData?.role === "vendor" || logInUserData?.role === "adminVendor") && <div className="mt-20">
        <div className="my-4 text-xl font-semibold">All Results: </div>
        <PrintTable
          endPoint="vendorAllRequestData"
          reApiCall={reApiCall}
          setData={setManageRequest}
          controllers={[]}
        />
      </div>}
    </div>
  )
}
