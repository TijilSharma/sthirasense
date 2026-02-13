import { Router } from 'express';
import { verifyToken } from '../client/utils/jwt.js';
import { SendResponse } from '../client/utils/helper.js';
import { apiKeyGenController } from './apiKeyGen.controller.js';

const apiGenRouter = Router();

apiGenRouter.get('/generate', (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        SendResponse(res, 401, "Authorization header missing");
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        SendResponse(res, 401, "Token missing");
        return;
    }
    try {
        const decoded = verifyToken(token);
        req.userId = decoded;
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err);
        SendResponse(res, 403, "Invalid token");
    }
        
}, apiKeyGenController);

export default apiGenRouter;