import mongoose from "mongoose";

const Products = mongoose.Schema({
  judul: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  luasBangunan: {
    type: String,
    required: true,
  },
  luasTanah: {
    type: String,
    required: true,
  },
  kamarTidur: {
    type: String,
    required: true,
  },
  kamarMandi: {
    type: String,
    required: true,
  },
  lantai: {
    type: String,
    required: true,
  },
  sertification: {
    type: String,
    required: true,
  },
  fasilitas: {
    type: Array,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date().getDate(),
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Products", Products);
