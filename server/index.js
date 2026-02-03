const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello from the Amplifyd server!');
}); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
module.exports = app;
