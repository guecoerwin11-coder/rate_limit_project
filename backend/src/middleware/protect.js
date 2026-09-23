const jwt = require("jsonwebtoken")
const {ForbiddenError} = require('../utils/classError')
const protect = (req, res, next) => {
    try{

        const authHead = req.headers.authorization;

        if(!authHead) {
            throw new ForbiddenError("invalid token or Expired")
        }

        const very = authHead.split(' ')[1];
        const decode = jwt.verify(very, process.env.JWTPASS)

        req.user = decode;
        next()
    }catch(err){
        next(err)
    }
}

module.exports = protect