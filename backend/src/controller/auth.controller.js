import { User } from "../model/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Registering user:", { name, email, password });
  try {
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Name, Email and password are required" });
    }
    const userAlreadyExists = await User.findOne({
      email,
    });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    generateToken(res, user._id); 


    res.status(201).json({
      success: true,
      message: "User created",
      user: {
        ...user.toObject(),
        password: undefined,
      },
    });

  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};


export const login  = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    generateToken(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true, message: "Logged in", user: {
        ...user.toObject(),
        password: undefined,
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};


export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out" });
};


