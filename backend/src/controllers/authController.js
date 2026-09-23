const prisma = require('../configs/postgres')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const {accessToken, freshToken} = require('../controllers/tokens')
const {
    BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError, internalServerError
} = require('../utils/classError')
const logger = require('../logger/logger')

const register = async (req, res, next) => {
    try{

        const {fullName, email, password, role} = req.body;

        if(!fullName || !email || !password || !role){
            logger.error('input field attempt error')
            throw new BadRequestError('Must input the required fields')
        }

        const isExist = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(isExist){
            logger.error('email attempt is already existed')
            throw new UnauthorizedError('Email is already use')
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                fullName, email, password: hashPass, role
            }
        });

        const token = accessToken(user);

        logger.info('new user successfully register')

        res.status(201).json({
            message: 'new user register',
            accessToken: token
        })
    }catch(err){
        next(err)
    }
}

const login = async (req, res, next ) => {
    try{

        const {email, password} = req.body;

        if(!email || !password){
            logger.error('input required attempt error')
            throw new BadRequestError("Email and Password is required")
        }

        const user = await prisma.user.findUnique({
            where:{
                email: email
            }
        })

        if(!user){
            logger.error("email attempt is not register")
            throw new UnauthorizedError("email is not register")
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            logger.error("password attempt is invalid")
            throw new UnauthorizedError("Invalid credentials or wrong password")
        }

        const token = accessToken(user);

        logger.info("user login success")

        res.status(200).json({
            message: "login success",
            accessToken: token
        })
    }catch(err){
        next(err)
    }
}

const forgotPassword = async (req, res, next) => {
    try{

        const {email} = req.body;

        if(!email){
            logger.error("email attempt is empty")
            throw new BadRequestError("must input fields email")
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(!user){
            throw new UnauthorizedError("email is not found")
        }

        const newToken = crypto.randomBytes(32).toString('hex')

        const passToken = crypto.createHash('sha256').update(newToken).digest('hex');

        const dateToken = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.user.update({
            where:{
                email: email
            },
            data:{
                passwordToken: passToken,
                resetToken: dateToken
            }
        })

        const link = `${process.env.CLIENT_URL}/forgot-password?token=${newToken}`

        res.status(200).json({
            message: 'check your email'
        })
       
    }catch(err){
        next(err)
    }
}

const resetPassword = async (req, res, next) => {
    try{

        const {token, password} = req.body;

        if(!token || !password){
            throw new BadRequestError("must input fields required")
        }

        if(password.length < 6){
            logger.error('password attempt error must be greater than 6 characters')
            throw new UnauthorizedError("new password is too short. at least 6 more characters")
        }

        const newToken = crypto.createHash('sha256').update(token).digest('hex');


        const user = await prisma.user.findFirst({
            data:{
                passwordToken: newToken,
                resetToken: {
                    $gt: new Date()
                }
            }
        });

        if(!user){
            logger.error("token is invalid")
            throw new UnauthorizedError("token is invalid or expired")
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        await prisma.user.update({
            where:{
                id: user.id
            },
            data: {
                password: hashPass,
                resetToken: null,
                passwordToken: null
            }
        });

        logger.info("new password saved")
        
        res.status(200).json({
            message: "change password success"
        })

        
    }catch(err){
        next(err)
    }
}

const logout = async (req, res, next) => {
    try{
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict'
        }

        res.clearCookies('accessToken', cookieOptions)
        res.clearCookies('refreshToken', cookieOptions)

        logger.info('User cookies cleared success')
        res.status(200).json({
            message: 'logout success'
        })
    }catch(err){
        next(err)
    }
}

module.exports = {
    register, login, forgotPassword, resetPassword, logout
}