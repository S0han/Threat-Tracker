const express = require("express");
const cors = require("cors");
const fetch = require('node-fetch');
const redis = require("redis");
const bcrypt = require('bcrypt');
const generateToken = require("./generateToken");
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
  legacyMode: true,
});
redisClient.connect().catch(console.error);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Main Page");
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    await redisClient.setEx(`auth-token:${user.id}`, 3600, token);

    res.json({ token });
});

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

app.get('/api/fetch-threats', async (req, res) => {
    const URL = "https://urlhaus-api.abuse.ch/v1/urls/recent/limit/10";

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString();
    };
    
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Repsonse status: ${response.status}`);
        };
        
        const data = await response.json();
        if (data.query_status !== "ok") {
            throw new Error("External API error")
        };

        const threat_list = data.urls.map(item => (
            {
                host: item.host,
                url: item.url,
                threat_type: item.threat,
                date_added: formatDate(item.date_added)
            }
        ));

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
    const URL = "http://localhost:3001/api/fetch-threats";
    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.error('Error fetching threats:', error.message);
    }
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    fetchThreatsOnce();
});