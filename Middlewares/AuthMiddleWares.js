const User = require('../Model/UserSchema')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const secrete_key = process.env.SECRETE_KEY;

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, secrete_key, async (error, decodedtoken) => {
            if (error) {
                res.json({ status: false })
                next()
            }
            else {
                const user = await User.findById(decodedtoken.id) 
                if (user) {
                    res.json({ status: true, user: user.email })
                    
                }
                else {
                    res.json({ status: false })
                    next()
                }
            }
        })
    }
    else {
        res.json({ status: false })
        next()
    }
}