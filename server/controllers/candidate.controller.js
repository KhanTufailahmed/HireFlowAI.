import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Candidate from "../models/candidate.model.js";

export const registerCandidate = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const candidate = await Candidate.findOne({ email: email });

    if (candidate) {
      return res.status(400).json({
        message: "Candidate already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Candidate.create({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Candidate account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const loginCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let candidate = await Candidate.findOne({ email: email });

    if (!candidate) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      candidate.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const tokenData = {
      userId: candidate._id,
      role: "candidate",
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    candidate = {
      _id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      role: "candidate",
      hiringStage: candidate.hiringStage,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${candidate.name}`,
        candidate: candidate,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logoutCandidate = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};