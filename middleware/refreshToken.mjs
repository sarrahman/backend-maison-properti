import Users from "../models/Users.mjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Tidak ada token yang tersedia",
      });
    }
    const user = await Users.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({
        message: "Token tidak valid",
      });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Token tidak valid",
        });
      }
      const payload = {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    });
  } catch (error) {
    console.log(error);
  }
};
