import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  logout,
  protect,
} from "../controllers/authController.js";
import { getAllThreadsOfUser } from "../controllers/threadController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword", resetPassword);
router.post("/logout", logout);

router.route("/").get(getAllUsers).post(protect, createUser);

router
  .route("/:id")
  .get(getUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

router.route("/:id/threads").get(getAllThreadsOfUser);

export default router;
