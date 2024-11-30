import mongoose from 'mongoose'

const { Schema } = mongoose

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  blocked: { type: Boolean, default: false },
  firstAccess: { type: Boolean, default: true },
  role: { type: String, required: true }
})

export default mongoose.model('User', UserSchema)
