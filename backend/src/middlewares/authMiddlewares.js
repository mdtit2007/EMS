import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRouted = async (req, res, next) => {
    try {
        // lay token tu header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        // xac nhan token hop le
        if (!token) {
            return  res.status(401).json({ message: "Khong co token" });
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
            if (err) {
                return res.status(403).json({ message: "AccessToken khong hop le" });
            }
            // tim user
            const user = await User.findById(payload.userId).select("-hashPassword");
            if (!user) {
                return res.status(404).json({ message: "Khong tim thay user" });
            }
            // tra ve user tren req
            req.user = user;
            next();
        });
    } catch (error) {
        console.error("Lỗi khi xac minh jwt  trong authMiddlewares:", error);
        return res.status(500).json({ message: "loi he thong" });
    }
};
