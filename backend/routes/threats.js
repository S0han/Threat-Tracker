const express = require('express');
const prisma = require('../config/db');

const router = express.Router();

app.get('/api/threats', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const threats = await prisma.threat.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { date_added: 'desc' }
        });

        res.json({ page, limit, threats });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;