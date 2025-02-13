const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ error: "Access Denied" });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid Token" });
    }
}

module.exports = authenticateToken;