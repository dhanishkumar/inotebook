const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Dhanishrajput';
// ROUTE: 1 create a user using:POST "/api/auth/createuser". No login require
router.post('/createuser', [
    body('name').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password must at least 5 character').isLength({ min: 5 }),
], async (req, res) => {
    //if there are errors, return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //check whether the user with this email exist already
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "please try to login with correct credentails" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        // Create a JWT Token
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken });

        //Catch the error
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// ROUTE: 2 Authentication a user using: POST "/api/auth/login".No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists(),
], async (req, res) => {

    //if there are errors, return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //check email or password
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });  //check email
        if (!user) {
            return res.status(400).json({ error: "please try to login with correct credentails" })
        }
        //check or compare password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "please try to login with correct credentails" })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// ROUTE: 3 get loggedin user details using :POST "/api/auth/getuser". login require
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});
module.exports = router;
