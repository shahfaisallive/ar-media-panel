const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const AdminModel = require('../models/Admin')

// Admin protected auth
const protectAdmin = asyncHandler(async (req, res, next) => {
const JWT_SECRET = "LSN23sds923knksdn0aswpcx32zxe312"

  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, JWT_SECRET)

      req.admin = await AdminModel.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports.protectAdmin= protectAdmin