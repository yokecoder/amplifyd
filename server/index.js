const express = require("express");
const cors = require("cors");
const ytstream = require("./routes/ytstreamer");


require("dotenv").config({
    path: `.env.${process.env.NODE_ENV || "development"}`
});
// Initialize an Express app
const app = express();

// Middlewares to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
   
app.use("/ytstream", ytstream);
// Root endpoint
app.get("/", (req, res) => {
    res.send("Amplifyd --- Feel Every Beat");
});



// Set the server to listen on port
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost"; // Accept external connections

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
