import express from 'express';
// import { login, logout, signup } from '../controllers/auth.controller.js';
// import protectRoute from '../middleware/protectRoute.js';
import { googleAuthController, googleAuthVerifier } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.get('/google', googleAuthController);
authRouter.get('/google/callback', googleAuthVerifier);



export default authRouter;