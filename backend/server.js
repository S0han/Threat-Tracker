const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const { router: threatRoutes, fetchThreatsOnce } = require("./routes/threats");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/login', authRoutes);
app.use('/api/threats', threatRoutes);

app.get('/', (req, res) => {
    res.send("Main Page");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    fetchThreatsOnce();
});