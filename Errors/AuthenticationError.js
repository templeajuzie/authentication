const CustomApiError = require('./CustomApiError');
const statusCodes = require('http-status-codes')

class AuthenticationError extends CustomApiError{
    constructor(message) {
        super(message);
        this.statusCodes = statusCodes;
    }
}

module.exports = AuthenticationError;