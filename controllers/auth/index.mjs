import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Users from "../../models/Users.mjs";

dotenv.config();

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await Users.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: "User Sudah Terdaftar",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new Users({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    return res.status(201).json({
      message: "User Berhasil Didaftarkan",
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User Tidak Terdaftar",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password Salah",
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
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: "24h",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    await Users.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
    return res.status(200).json({
      message: "Login Berhasil",
      token,
      uid: user._id,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
};

export const Profile = async (req, res) => {
  res.status(200).send(req.decoded);
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "User Tidak Terdaftar",
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama,
      phone,
      address,
      city,
      email,
      username,
      isSeller,
      about,
      province,
      whatsapp,
    } = req.body;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "User Tidak Terdaftar",
      });
    }
    const newUser = {
      nama: nama || user.nama,
      isSeller: isSeller || false,
      about: about || user.about,
      address: {
        street: address || user.address.street,
        city: city || user.address.city,
        province: province || user.address.province,
      },
      contact: {
        whatsapp: whatsapp || user.contact.whatsapp,
        phone: phone || user.contact.phone,
      },
      email: email || user.email,
      username: username || user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: new Date(),
    };
    await Users.findByIdAndUpdate(id, newUser);
    return res.status(200).json({
      message: "User Berhasil Diupdate",
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
};

export const registerGoogle = async (req, res) => {
  const { username, email, photoUrl } = req.body;
  const user = await Users.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: "User Sudah Terdaftar",
    });
  }
  const newUser = new Users({
    username,
    email,
    photoUrl,
  });
  try {
    await newUser.save();
    return res.status(201).json({
      message: "User Berhasil Ditambahkan",
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
};

export const loginGoogle = async (req, res) => {
  try {
    const { email, photoUrl } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User Tidak Terdaftar",
      });
    }
    const payload = {
      user: {
        id: user._id,
        email: user.email,
      },
    };
    await Users.findByIdAndUpdate(user._id, {
      photoUrl: photoUrl || user.photoUrl,
    });
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      message: "Login Berhasil",
      token,
      uid: user._id,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
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
    await Users.findByIdAndUpdate(user._id, { refreshToken: "" });
    res.clearCookie("refreshToken");
    return res.status(200).json({
      message: "Logout Berhasil",
    });
  } catch (error) {}
};
