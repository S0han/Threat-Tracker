require('dotenv').config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");


const app = express();
const PORT = 3001;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("Unable to load JWT_SECRET from .env file")
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Main Page");
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    const mockUser = { id: 1, username: "admin", password:"password123" };
    if (username !== mockUser.username || password !== mockUser.password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: mockUser.id, username: mockUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    res.json({ token });
});

app.get('/api/threats', async (req, res) => {
    const URL = "https://urlhaus-api.abuse.ch/v1/urls/recent/limit/10";
    
    try {
        const page = parseInt(req.query.page) || 1;
        if (isNaN(page)) {
            throw new Error("Invalid page number");
        };
        
        const limit = parseInt(req.query.limit) || 5;
        if (isNaN(limit)) {
            throw new Error("Invalid limit value")
        };

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
                id: item.id,
                host: item.host,
                url: item.url,
                threat_type: item.threat,
                date_added: item.date_added
            }
        ));

        const startIndex = (page - 1) * limit;
        const page_threat_list = threat_list.slice(startIndex, startIndex + limit);

        res.json(
            { 
                page: page, 
                limit: limit, 
                threats: page_threat_list 
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});