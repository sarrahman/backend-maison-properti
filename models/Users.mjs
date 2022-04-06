import mongoose from "mongoose";

const Users = mongoose.Schema({
  username: {
    type: String,
    required: true,
    allowNull: false,
    unique: true,
  },
  nama: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    allowNull: false,
  },
  password: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "",
  },
  contact: {
    phone: {
      type: Number,
      default: 62,
    },
    whatsapp: {
      type: Number,
      default: 62,
    },
  },
  address: {
    street: {
      type: String,
      default: "",
    },
    province: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
  },
  isSeller: {
    type: Boolean,
    default: false,
  },
  photoUrl: {
    type: String,
  },
  refreshToken: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Users", Users);
