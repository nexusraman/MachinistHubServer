import express from 'express'
const router = express.Router();
import {
    register,
    login,
    forgotPassword,
    resetPassword,
   }  from '../controllers/auth.js'

router.post("/register", (register));
router.post("/login", (login));
router.post("/forgotPassword", (forgotPassword));
router.put("/passwordReset/:resetToken", (resetPassword));

export default router
