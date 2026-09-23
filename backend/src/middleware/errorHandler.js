const logger = require('../logger/logger')
const errorHandler = (err, req, res) => {
    const status = err.status || 500
    const message = err.message || "Internal Server Error"

    console.log(`Status: ${status}, Message: ${message}`)

    logger.error({
        success: false,
        statusCode: status,
        path: req.path,
        method: req.method,
        timeStamp: new Date().toString()
    })


    const response = {
        success: false,
        status: status,
        message: message,
        timeStamp: new Date().toString()
    }

    res.status(status).json(response)
}

module.exports = errorHandler