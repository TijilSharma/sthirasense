import express from 'express';
// import { login, logout, signup } from '../controllers/auth.controller.js';
// import protectRoute from '../middleware/protectRoute.js';
import { getUSDTController, getProfileController} from '../controllers/output.controllers.js';
import { checkClientAuth } from '../middleware/client.middleware.js';

const outputRouter = express.Router();

outputRouter.get('/data/usdt', getUSDTController);
outputRouter.get('/profile', checkClientAuth, getProfileController);




export default outputRouter;