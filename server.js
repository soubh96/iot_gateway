const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const ipAddress = '0.0.0.0'; // Replace with your desired IP address



app.use(bodyParser.json());

let latestData = {}; // Store the latest received data

// POST endpoint to receive data
app.post('/receive-data', (req, res) => {
    console.log('Received data:');
    console.log(req.body);
    latestData = req.body; // Store the received data
    res.send('Data received successfully');
});

// GET endpoint to retrieve latest data
app.get('/latest-data', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(latestData); // Return the latest received data as JSON
});


// Start the server
app.listen(port, ipAddress, () => {
    console.log(`Server running at http://${ipAddress}:${port}`);
});
