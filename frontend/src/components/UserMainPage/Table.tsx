import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Spinner } from '@material-tailwind/react';
import { getRequest } from '../../Service/Service';
import { Button } from '@material-tailwind/react'

const PrintTable = ({ endPoint }: { endPoint: string }) => {

  useEffect(() => {
    getTableData()
    // eslint-disable-next-line
  }, [endPoint.length > 0])

  const [spinner, setSpinner] = useState(0)
  const [tableData, setTableData] = useState<Array<any>>([])
  const [noData, setNodata] = useState(0)
  const getTableData = () => {
    setSpinner(1)
    getRequest(`${endPoint}`).then((res) => {
      console.log(res.message, 'tableData')
      if (res.message?.length > 0) {
        setTableData(res?.message)
      }
      else {
        setNodata(1)
      }
      setSpinner(0)
    }).catch((err) => {
      console.log(err)
    })
  }
  return (
    <div className=''>
      {tableData.length > 0 ?
        <TableContainer component={Paper} sx={{ maxHeight: 400 }} style={{ backgroundColor: "transparent" }}>
          <Table>
            <TableHead>
              <TableRow>
                {
                  Object.keys(tableData[0]).map((d, j) => {
                    return (
                      <TableCell key={j} sx={{ border: 2, borderColor: 'white' }} align="center"><span className='text-xl font-semibold text-white'>{d}</span>
                      </TableCell>
                    )
                  })
                }
                <TableCell sx={{ border: 2, borderColor: 'white' }} align="center"><span className='text-xl font-semibold text-white'>Controls</span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((e, i) => (
                <TableRow key={i}>
                  {
                    Object.values(e).map((a, i) => (
                      <TableCell key={i} scope="row" align="center" sx={{ border: 2, borderColor: 'white' }} ><span className='text-lg text-white'>{a as string}</span></TableCell>
                    ))
                  }
                  <TableCell scope="row" align="center" sx={{ border: 2, borderColor: 'white' }} >
                    <div className='flex justify-center w-max mx-auto'>
                      <div className='me-3'>
                        <Button placeholder={'edit'} color='green'>Edit</Button>
                      </div>

                      <div className='ms-3'>
                        <Button placeholder={'delete'} color='red'>Delete</Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        :
        <div className='w-max mx-auto'>
          {spinner === 1 && <Spinner className="h-8 w-8 text-white " />}
          {noData === 1 && <div className='w-max mx-auto mt-5 text-2xl font-semibold text-red-700 border-2 border-red-700 p-3'>
            No Data Available
          </div>}
        </div>
      }
    </div >
  )
}

export default PrintTable
