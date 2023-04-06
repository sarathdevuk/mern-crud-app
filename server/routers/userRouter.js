import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("hai iam user");
});

router.post('/register',registerUser)
router.post('/login',loginUser)



export default router;
