import express from 'express'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../auth/genrateToken.js'
import { protect } from './../auth/authMiddleware.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'

//*@desc update profile
//*@Api PUT /api/v1/profile
//*@Access Private

const router = express.Router()

router.put(
  '/profile',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
      user.firstName = req.body.firstName || user.firstName
      user.secondName = req.body.secondName || user.secondName
      user.email = req.body.email || user.email
      user.number = req.body.number || user.number
      user.city = req.body.city || user.city
      user.gender = req.body.gender || user.gender
      user.birthday = req.body.birthday || user.birthday
      user.expireDate = req.body.expireDate || user.expireDate
      user.pin = req.body.pin || user.pin
      const updatedUser = await user.save()

      res.status(200).json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        secondName: updatedUser.secondName,
        email: updatedUser.email,
        number: updatedUser.number,
        city: updatedUser.city,
        gender: updatedUser.gender,
        expireDate: updatedUser.expireDate,
        token: generateToken(user._id),
      })
    } else {
      res.status(404)
      throw new Error('User not Found')
    }
  })
)
router.post(
  '/forgetpassword',
  asyncHandler(async (req, res) => {
    const { email } = req.body
    const alreadyExist = await User.findOne({ email })
    if (!alreadyExist) {
      return res
        .status(404)
        .json({ status: 'error', error: 'email is Registered yet.' })
    } else {
      if (alreadyExist) {
        let emailToken = generateToken(alreadyExist._id)
        const url = `http://localhost:5000/api/v1/updatepassword/${emailToken}`
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'hamidmehmood2117@gmail.com',
            pass: 'dimah9530',
          },
        })
        const mailOptions = {
          from: 'vindication@enron.com',
          to: email,
          subject: 'Confirm Email',
          html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
        }
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error)
          } else {
            console.log('Email sent: ' + info.response)
          }
        })
        res.status(201).json({
          message: 'Done',
        })
      }
    }
    return res.status(500).json({
      status: 'error',
      error: 'Cannot do this  at the moment',
    })
  })
)

//*@desc update password
//*@Api PUT /api/v1/api/changepassword
//*@Access Private

router.get(
  '/updatepassword/:token',
  asyncHandler(async (req, res) => {
    const decode = jwt.verify(req.params.token, 'dimahdani9530')
    let code = decode.id
    const user = await User.findById(code)

    if (!user) return res.status(404).json({ message: 'Email is not found !' })
    const token = generateToken(user._id)
    if (user) {
      return res.status(210).json('good')
    }
  })
)

export default router
