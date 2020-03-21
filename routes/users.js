const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');


//--------------------MODELS--------------------//
const User = require('../models/User');

//--------------------METHODS--------------------//
const {validateSignup, trimVal, trimCased} = require('../functions/validate');

//--------------------LOCAL METHODS--------------------//
const checkUsername = reqName => {
    return User.findOne({username: reqName});
}

//--------------------SIGNUP--------------------//
router.post('/register', async (req, res) => {
    const {error} = validateSignup({password: req.body.password});

    if (error) {
        const details = {...error.details[0]}
        res.statusMessage = "Invalid Password";
        return res.status(400).send({error: {status: 400, message: "Password must be at least 6 characters long."}});    
    }

    const trimmedUsername = trimVal(req.body.username);
    // console.log(trimmedUsername)

    const isNameTaken = await checkUsername(trimmedUsername);
    // console.log(isNameTaken)
    if (isNameTaken) {
        res.statusMessage = "Username Taken"
        return res.status(409).send({error: {status: 409, message: "This Username is taken."}});
    }
})

module.exports = router;