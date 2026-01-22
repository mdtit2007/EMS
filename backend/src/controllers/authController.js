import bycrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js'; 

const ACCESS_TOKEN_TTL= '30m';
const REFRESH_TOKEN_TTL= 14*24*60*60*1000; //14 ngay miligiay

export const signUp = async (req, res) => {
    try {
        const {username,email,password,firstName,lastName} = req.body;
        if(!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({message: "Không thể để trống các trường"});
        }
        // kiem tra user da ton tai chua
        const duplicate = await User.findOne({$or: [{username}, {email}]});
        if(duplicate) {
            return res.status(409).json({message: "Username hoặc email đã tồn tại"});
        }
        // ma hoa mk
        const salt = await bycrypt.genSalt(10);
        const hashPassword = await bycrypt.hash(password, salt);
        // tao user moi
        const newUser = new User({
            username,
            email,
            hashPassword,
            displayName: `${firstName} ${lastName}`
});
         await newUser.save();
        // luu vao db
        res.sendStatus(204);
    } catch (error) {
        console.error("Lỗi khi gọi signup:", error);
        res.status(500).json({message: "Lỗi máy chủ"});
        
    }


};
export const signIn = async (req, res) => {
   try {
    // lay input tu req.body
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    }
    // tim user trong db
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }
    // so sanh password voi hashPassword 
    const passwordCorect = await bycrypt.compare(password, user.hashPassword);
    if (!passwordCorect) {
      return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }
    // tao access token voi jwt
    const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL});
    // tao refresh token    
    const refreshToken = crypto.randomBytes(64).toString('hex');
    //tao secsion luu refresh token vao db
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL);
    const newSession = new Session({
        userId: user._id,
        refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    await newSession.save();
    // tra ve refresh token trong cookie 
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: REFRESH_TOKEN_TTL,
    });
    // tra ve access token trong res
    return res.status(200).json({ message: `user ${user.displayName} đăng nhập thành công`, accessToken });
   } catch (error) {
    console.error("Lỗi khi gọi signin:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
   }
}


