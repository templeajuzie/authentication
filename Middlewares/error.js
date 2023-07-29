const ErrorHandler = require('../Utils/ErrorHandler');

module.export = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server Error"

    //mongodb id error
    if (err.name === "CastError") {
        const message = `Resource not found with this id... invalid ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    //duplicate email
    if (err.code === 1100) {
        const message = `Duplicate keys ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400)
    }

    //wrong jwt
    if (err.name === "JsonWebTokenError") {
        const message = `Your url is invalid, please try again later`
        err = new ErrorHandler(message, 400)
    }

    //expired jwt
    if (err.name === "TokenExpired") {
        const message = `this session has expred, please sign in again`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })

}

