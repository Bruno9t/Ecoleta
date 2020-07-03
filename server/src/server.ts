import express from 'express'
import cors from 'cors'
import routes from './routes'
import {errors} from 'celebrate'

import {resolve} from 'path'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.use('/uploads',express.static(resolve('uploads')))

app.use(errors())

app.listen(3333,()=>{
    console.log('Server running...')
})