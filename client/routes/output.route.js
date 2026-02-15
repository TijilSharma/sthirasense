import express from 'express';
// import { login, logout, signup } from '../controllers/auth.controller.js';
// import protectRoute from '../middleware/protectRoute.js';
import { getUSDTController, getProfileController} from '../controllers/output.controllers.js';
import { checkClientAuth } from '../middleware/client.middleware.js';
import { getMarketData } from '../../api/api.controller.js';
import { pool } from '../../server.js';
import { SendResponse } from '../utils/helper.js';

const outputRouter = express.Router();

outputRouter.get('/data/usdt', getUSDTController);
outputRouter.get('/profile', checkClientAuth, getProfileController);
outputRouter.get('/market/:symbol/:interval', getMarketData);
outputRouter.get('/predict/:symbol/:interval',async (req, res) => {
  try {
      const { symbol, interval } = req.params;
  
      const tableName = `outputs`;
  
      const result = await pool.query(
        `SELECT * FROM "${tableName}"
     ORDER BY id DESC
     LIMIT 100`
      );
  
      return SendResponse(res, 200, true, "Market data retrieved successfully", {
        symbol,
        interval,
        data: result.rows,
      });
    } catch (err) {
      console.error(err);
      return SendResponse(res, 500, false, "Server error");
    }
});



export default outputRouter;