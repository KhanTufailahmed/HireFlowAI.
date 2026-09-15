import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const admin = await Admin.findOne({ email: email });

    if (admin) {
      return res.status(400).json({
        message: "Admin already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Admin account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let admin = await Admin.findOne({ email: email });

    if (!admin) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const tokenData = {
      userId: admin._id,
      role: "admin",
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    admin = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: "admin",
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${admin.name}`,
        admin: admin,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};