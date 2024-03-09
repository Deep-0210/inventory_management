import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import route from './Routes/Routs'

const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())

mongoose.connect(`${process.env.Database_Connection}/inventory`).then(() =>console.log("Database Connected..")).catch((err) => console.log(err))
app.use('/',route)

app.listen(`${process.env.Server_Port}`, () => {
    console.log("Server is running....")
})