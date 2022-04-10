import express from "express";
import {
  getUser,
  loginUser,
  logout,
  Profile,
  registerUser,
  updateUser,
} from "../controllers/auth/index.mjs";
import {
  addProducts,
  deleteProduct,
  getProductById,
  getProducts,
  getProductsByUid,
  updateProduct,
} from "../controllers/products/index.mjs";
import { refreshToken } from "../middleware/refreshToken.mjs";
import { verifyToken } from "../middleware/verifyToken.mjs";

const router = express.Router();

router.get("/api/token", refreshToken);

router.post("/api/auth/register", registerUser);
router.post("/api/auth/login", loginUser);
router.get("/api/auth/user/:id", getUser);
router.patch("/api/auth/user/:id", updateUser);
router.get("/api/auth/profile", verifyToken, Profile);
router.delete("/api/logout", logout);

router.get("/api/products", getProducts);
router.get("/api/product/:id", getProductById);
router.get("/api/products/uid/:uid", getProductsByUid);
router.post("/api/product", addProducts);
router.patch("/api/product/:id", updateProduct);
router.delete("/api/product/:id", deleteProduct);

export default router;
