import express from 'express'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../auth/genrateToken.js'
//*@desc Auth the user
//*@Api GET /api/v1/login
//*@Access Public

const router = express.Router()

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    // .lean()
    // .catch((err) => {
    //   console.log('Error: ', err)
    // })

    if (!user) return res.status(404).json({ message: 'Email is not found !' })

    if (user && password && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
        token: generateToken(user._id),
      })
    } else {
      return res.status(403).json({ message: 'Wronge password!' })
    }
  })
)

export default router
