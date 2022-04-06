import express from "express";
import {
  getUser,
  loginGoogle,
  loginUser,
  logout,
  Profile,
  registerGoogle,
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

router.get("/token", refreshToken);

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/user/:id", getUser);
router.patch("/auth/user/:id", updateUser);
router.post("/auth/google/register", registerGoogle);
router.post("/auth/google/login", loginGoogle);
router.get("/auth/profile", verifyToken, Profile);
router.delete("/logout", logout);

router.get("/products", getProducts);
router.get("/product/:id", getProductById);
router.get("/products/uid/:uid", getProductsByUid);
router.post("/product", addProducts);
router.patch("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

export default router;
