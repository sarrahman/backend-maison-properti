import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      message: "token tidak ditemukan",
    });
  }

  const token = authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).json({
      message: "token kosong",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "token tidak valid",
      });
    }

    if (decoded.exp < Date.now() / 1000) {
      return res.status(403).json({
        message: "token expired",
      });
    }

    req.decoded = decoded;
    next();
  });
};
