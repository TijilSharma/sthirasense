import { SendResponse } from "../utils/helper.js";

export function checkClientAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return SendResponse(res, 401, "Authorization header missing");
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return SendResponse(res, 401, "Token missing");
    }
    try {
        const decoded = verifyToken(token);
        req.userId = decoded;
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err);
        return SendResponse(res, 403, "Invalid token");
    }
}