const express = require("express");
const cors = require("cors");
const prisma = require('./config/db');
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/login', authRoutes);

app.get('/', (req, res) => {
    res.send("Main Page");
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