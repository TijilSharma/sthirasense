import { Router } from 'express';
import { verifyToken } from '../client/utils/jwt.js';
import { SendResponse } from '../client/utils/helper.js';
import { apiKeyGenController } from './apiKeyGen.controller.js';

const apiGenRouter = Router();

apiGenRouter.get('/generate', apiKeyGenController);

export default apiGenRouter;