const logger = require('../logger/logger')

const measureApiSpeed = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
    })
}

module.exports = measureApiSpeed;