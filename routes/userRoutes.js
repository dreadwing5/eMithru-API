const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const threadController = require("../controllers/threadController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.get("/logout", authController.logout);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route("/:id/threads").get(threadController.getAllThreadsOfUser);

module.exports = router;
