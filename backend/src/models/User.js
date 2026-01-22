import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  hashPassword: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  role:{
    type: String,
    enum: ['admin', 'user','teacher'],
  },
  avatarurl:{
    type: String,
  },
  avatarid:{
    type: String,
    },
  phone:{
    type: String,
    sparse:true,
    },
}, {
     timestamps: true 
    }
);

export const User = mongoose.model("User", userSchema);
export default User;