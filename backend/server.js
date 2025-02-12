const express = require("express");
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    res.send("Main Page");
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
                host: item.host,
                url: item.url,
                threat_type: item.threat,
                date_added: item.date_added
            }
        ));

        const startIndex = (page - 1) * limit;
        const pag_threat_list = threat_list.slice(startIndex, startIndex + limit);

        res.json(
            { 
                page: page, 
                limit: limit, 
                threats: pag_threat_list 
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