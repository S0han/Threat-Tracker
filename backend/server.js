const express  = require("express");
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send("Setup Success!")
});

app.get('/api/threats', async (req, res) => {
    const URL = "https://urlhaus-api.abuse.ch/v1/urls/recent/limit/10/";
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Repsonse status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});