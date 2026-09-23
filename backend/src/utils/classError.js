class BadRequestError extends Error {
    constructor(message){
        super(message);
        this.status = 400
        this.name = "Bad Request Error"
    }
}

class NotFoundError extends Error {
    constructor(message){
        super(message);
        this.status = 404
        this.name = "Not Found Error"
    }
}

class UnauthorizedError extends Error {
    constructor(message){
        super(message);
        this.status = 401
        this.name = "Unauthorized Error"
    }
}

class internalServerError extends Error {
    constructor(message){
        super(message);
        this.status = 500
        this.name = "Internal Service Error"
    }
}

class ForbiddenError extends Error {
    constructor(message){
        super(message);
        this.status = 403
        this.name = "Forbidden Error"
    }
}

module.exports = {
    BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError, internalServerError
}