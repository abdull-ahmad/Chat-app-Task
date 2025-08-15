import { User } from '../model/user.model.js';
import jwt from 'jsonwebtoken';

export const verifyToken = async (req ,res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Token not found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    if (!decoded) {
     
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      
      return res.status(401).json({ success: false, message: "Unauthorized - User not found" });
    }
     req.user = user ; // Attach user to request object

    
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};