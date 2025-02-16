const express = require('express');
const prisma = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
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

router.get('/fetch', async (req, res) => {
    const URL = "https://urlhaus-api.abuse.ch/v1/urls/recent/limit/10";
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString();
    };
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        if (data.query_status !== "ok") {
            throw new Error("External API error");
        }
        const threat_list = data.urls.map(item => ({
            host: item.host,
            url: item.url,
            threat_type: item.threat,
            date_added: formatDate(item.date_added)
        }));
        await prisma.threat.createMany({
            data: threat_list,
            skipDuplicates: true
        });
        res.json({
            message: "Threats fetched and stored successfully",
            count: threat_list.length
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const fetchThreatsOnce = async () => {
    const URL = "http://localhost:3001/api/threats/fetch";
    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error fetching threats:', error.message);
    }
};

module.exports = { router, fetchThreatsOnce };