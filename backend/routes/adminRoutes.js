const asyncHandler = require('express-async-handler')
const Admin = require('../models/Admin')
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();


// Create Admin
router.post('/createSuperAdmin', asyncHandler(async (req, res, next) => {
    const { username, password } = req.body

    let token;

    let admin = await Admin.findOne({ isSuperAdmin: true })
    if (admin) {
        // const error = 'Super Admin already registered. There can be only one superAdmin';
        // return next(error);
        res.send({msg: 'Admin already exists, use that admin credentials to sign in'})
    } else {
        try {
            admin = Admin()
            admin.username = username
            admin.password = password
            admin.isSuperAdmin = true
            token = admin.getToken()
            await admin.save()
        }
        catch (err) {
            console.log(err)
        }

        res.json({
            _id: admin._id,
            username: admin.username,
            isSuperAdmin: admin.isSuperAdmin,
            token: token
        })
    }
}))


// Admin Login
router.post('/login', asyncHandler(async (req, res, next) => {
    const { username, password } = req.body

    const admin = await Admin.findOne({ username })

    if(admin){
        const token = await admin.getToken()
        if (admin && (await admin.matchPassword(password))) {
            res.send({status: true, msg: "Successfully signed in", token: token})
        } else {
            // res.status(401)
            // throw new Error('Invalid username or password')
            res.send({status: false, msg: "Invalid Username or Password", token: null})
        }
    } else {
        res.send({status: false, msg: "Username not found", token: null})
    }
    
}))


module.exports = router;