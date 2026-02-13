import express from 'express';
import { Router } from 'express';
import { apiKeyAuth } from './api.middleware.js';
import { getMarketData } from './api.controller.js';

const apiRouter = Router();

apiRouter.use(apiKeyAuth);
apiRouter.get('/:symbol/:interval', getMarketData);

export default apiRouter;