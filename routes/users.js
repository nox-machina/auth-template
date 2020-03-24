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

    try {
        //--------------------PASSWORD--------------------//
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        //--------------------CREATE USER--------------------//
        const user = new User;
        user.username = trimmedUsername;
        user.password = hash;

        await user.save();

        // console.log(user)

        //--------------------JWT--------------------//
        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1 minute"}, async (err, actkn) => {
            if (!err) {
                let date = new Date();
                date.setTime(date.getTime() + 62000);
                res.cookie('actkn', actkn, {domain: 'localhost', secure: false, httpOnly: true, expires: date})
            }
        })

        jwt.sign(payload, process.env.RFTKN_SECRET, {expiresIn: "90 seconds"}, async (err, rftkn) => {
            if (!err) {
                let date = new Date();
                date.setTime(date.getTime() + 92000);
                res.cookie('rftkn', rftkn, {domain: 'localhost', secure: false, httpOnly: true, expires: date}).status(201).send({valid: true, user: user})
            }
        })

    } catch (error) {
        res.status(500).send({error: error})
    }

})

module.exports = router;