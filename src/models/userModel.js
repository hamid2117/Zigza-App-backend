import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    code: { type: String },
    confirmation: { type: Boolean, required: true, default: false },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function matchPassword(data) {
  return await bcrypt.compare(data, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
