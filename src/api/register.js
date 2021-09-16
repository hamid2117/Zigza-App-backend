import express from 'express'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import nodemailer from 'nodemailer'
import generateToken from '../auth/genrateToken.js'
import { protect } from '../auth/authMiddleware.js'
const router = express.Router()

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, address, teacher, email, password } = req.body
    const alreadyExist = await User.findOne({ email })
    if (alreadyExist) {
      return res
        .status(409)
        .json({ status: 'error', error: 'email already in use' })
    } else {
      const user = await User.create({
        name,
        address,
        teacher,
        email,
        password,
      })
      if (user) {
        const codee = Math.floor(Math.random() * 9999 + 999)
        codee = String(codee)
        codee = codee.substring(0, 4)
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'zigza@gmail.com',
            pass: 'Zigzaapp@2117',
          },
        })
        const mailOptions = {
          from: 'ZigzaApp@Business.com',
          to: email,
          subject: 'Confirm Email',
          html: `Please Write this code in your App: <h2>${codee}</h2>`,
        }
        user.code = codee
        user.save()
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error)
          } else {
            console.log('Email sent: ' + info.response)
          }
        })
        res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          phone: user.phone,
          token: generateToken(user._id),
        })
      }
    }
    return res.status(500).json({
      status: 'error',
      error: 'Cannot register user at the moment',
    })
  })
)

router.get(
  '/confirmation',
  protect,
  asyncHandler(async (req, res) => {
    const { code } = req.body
    const { _id } = req.user
    const user = await User.findById(_id)

    if (user.code === code) {
      user.confirmation = true
      await user.save()
      return res.status(202).json({ message: 'Verified' })
    }
  })
)

export default router
