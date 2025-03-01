const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

//create a user using:POST "/api/auth/createuser". No login require
router.post('/createuser', [
    body('name').isLength({ min: 5 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    //if there are errors, return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user exist already
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "sorry a user with the email already exist" })
        }
        //create user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        res.json(user)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some Error occures");
    }
});
module.exports = router;
