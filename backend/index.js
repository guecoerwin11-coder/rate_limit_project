require('dotenv').config()
const express = require('express')
const router = require('./src/routes/routes')
const errorHandler = require('./src/middleware/errorHandler')

const app = express()

app.use(express.json())

app.use(errorHandler)

app.use('/api', router)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`server run: http://localhost:${PORT}`)
})