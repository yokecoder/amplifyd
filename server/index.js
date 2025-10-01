const express = require("express");
const apiss = require("./routes/apiss.js");
const cors = require("cors");
require("dotenv").config();

// Initialize an Express app
const app = express();

// Middlewares to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
);

app.use("/apiss", apiss)
// Root endpoint
app.get("/", (req, res) => {
    res.send("Amplifyd --- Feel Every Beat");
});



// Set the server to listen on port
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0"; // Accept external connections

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
