const jwt = require("jsonwebtoken");
const { redisClient } = require("./server");

function authMiddleware(req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Access Denied" });
    }

    const tokenWithoutBearer = token.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        const userId = decoded.id;

        redisClient.get(`auth-token:${userId}`, (err, redisToken) => {
            if (err || !redisToken) {
                return res.status(401).json({ error: "Invalid or expired token" });
            }

            if (tokenWithoutBearer === redisToken) {
                req.user = decoded;
                next();
            } else {
                return res.status(403).json({ error: "Token mismatch or expired" });
            }
        });
    } catch (error) {
        return res.status(403).json({ error: "Invalid Token" });
    }
}

module.exports = authMiddleware;
