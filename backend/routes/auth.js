const express = require('express');
const argon2 = require('argon2');
const generateToken = require('../utils/generateToken');
const prisma = require('../config/db');
const { redisClient } = require('../config/redis');

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    await redisClient.setEx(`auth-token:${user.id}`, 3600, token);

    res.json({ token });
});

module.exports = router;