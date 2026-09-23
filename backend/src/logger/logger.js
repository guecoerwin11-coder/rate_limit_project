const winston = require("winston")
const path = require('path')

const logFolder = path.joini(__dirname, '../../logs');

const logger = winston.createLogger({
    level: 'info',
    format: winston.createLogger(
        winston.format.timestamp({ timestamp: 'YY-MM-DD HH:mm:ss'}),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logFolder, 'error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join(logFolder, 'success.js')
        })
    ]
})

module.exports = logger