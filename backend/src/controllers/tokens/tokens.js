const jwt = require('jsonwebtoken')

const accessToken = (user) => {
    return jwt.sign(
        {
            id: user.id, fullName: user.fullName, email: user.email, role: user.role
        },
        process.env.JWTPASS,
        {expiresIn: '1d'}
    )
}

const freshToken = (user) => {
    return jwt.sign(
        {
            id: user.id, fullName: user.fullName, email: user.email, role: user.role
        },
        process.env.JWTFRESH,
        {expiresIn: '3d'})
}

module.exports = {
    accessToken, freshToken
}