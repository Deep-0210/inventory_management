import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table'
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { Spinner, Button } from '@material-tailwind/react'
import { getRequest } from '../../Service/Service'
import { TableTypes } from '../../Types/Types'
import { useNavigate } from 'react-router-dom'

const PrintTable = ({
  endPoint,
  reApiCall,
  setData,
  controllers
}: TableTypes) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/')
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (endPoint.length) {
      getTableData()
    }
    // eslint-disable-next-line
  }, [endPoint.length > 0])

  useEffect(() => {
    if (reApiCall === 1) {
      getTableData()
    }
    // eslint-disable-next-line
  }, [reApiCall])

  const [spinner, setSpinner] = useState<number>(0)
  const [tableData, setTableData] = useState<Array<any>>([])
  const [noData, setNoData] = useState<number>(0)

  const getTableData = () => {
    setNoData(0)
    setSpinner(1)
    getRequest(`${endPoint}`)
      .then(res => {
        if (res.message?.length > 0) {
          setTableData(res?.message)
        } else {
          setTableData([])
          setNoData(1)
        }
        setSpinner(0)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const findTableKeys = (e: string) => {
    switch (e) {
      case '_id':
        return 'S.no'

      case 'productName':
        return 'Product Name'

      case 'productQuantity':
        return 'Product Quantity'

      case 'productPrice':
        return 'Product Price'

      case 'email':
        return 'Email'

      case 'firstName':
        return 'First Name'

      case 'lastName':
        return 'Last Name'

      case 'country':
        return 'Country'

      case 'city':
        return 'City'

      case 'role':
        return 'Role'

      default:
        return e
    }
  }

  // Function for delete the stock data
  const getDataForDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = (e.target as HTMLButtonElement)?.id
    const data = tableData.find(e => e._id === id)
    const value = (e.target as HTMLButtonElement)?.value
    setData({ ...data, status: value })
  }

  // Function to get the data for edit
  const editData = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = (e.target as HTMLButtonElement)?.id
    const data = tableData.find(e => e._id === id)
    const value = (e.target as HTMLButtonElement)?.value
    setData({ ...data, status: value })
  }

  const buttonColor = (k: string) => {
    switch (k) {
      case 'edit':
        return 'green'

      case 'delete':
        return 'red'

      case 'accept':
        return 'green'

      case 'reject':
        return 'red'

      default:
        return 'green'
    }
  }

  return (
    <div className="h-full w-full">
      {/* {tableData.length > 0 ? ( */}
      <div className={`${tableData?.length === 0 ? 'hidden' : ''}`}>
        {tableData?.length > 0 && <TableContainer component={Paper} style={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(tableData[0]).map((d, j) => {
                  return (
                    <TableCell key={++j} sx={{ border: 2, borderColor: 'white' }} align="center">
                      <span className="text-xl font-semibold text-white">
                        {findTableKeys(d)}
                      </span>
                    </TableCell>
                  )
                })}
                {controllers?.length > 0 && <TableCell sx={{ border: 2, borderColor: 'white' }} align="center">
                  <span className="text-xl font-semibold text-white">
                    Controls
                  </span>
                </TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((e, i) => {
                return (
                  <TableRow key={++i}>
                    {Object.values(e).map((a, j) => {
                      return (
                        <TableCell key={++j} scope="row" align="center" sx={{ border: 2, borderColor: 'white' }}>
                          <span className="text-lg text-white">
                            {j === 0 ? ++i : (a as string)}
                          </span>
                        </TableCell>
                      )
                    })}
                    {controllers?.length > 0 && <TableCell scope="row" align="center" sx={{ border: 2, borderColor: 'white' }} >
                      <div className="flex justify-center w-max mx-auto">
                        {controllers.map((k: string, h: number) => {
                          return (
                            <div className="me-3" key={++h}>
                              <Button placeholder={k} color={buttonColor(k)} id={e._id}
                                onClick={e => k === 'delete' ? getDataForDelete(e) : editData(e)} value={k}>
                                {k}
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </TableCell>}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>}
      </div>
      {/* ) : ( */}
      <div className="w-max mx-auto">
        {spinner === 1 && <Spinner className="h-8 w-8 text-white " />}
        {(noData === 1 && tableData?.length === 0) && (
          <div className="w-max mx-auto mt-5 text-2xl font-semibold text-white p-3">
            No Data Available
          </div>
        )}
      </div>
      {/* )} */}
    </div>
  )
}

export default PrintTable
