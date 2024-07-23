const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = const port = process.env.PORT || 3000;

app.use(bodyParser.json());

let latestData = {}; // Store the latest received data

// POST endpoint to receive data
app.post('/receive-data', (req, res) => {
    console.log('Received data:');
    console.log(req.body);

    // Extract temperature and moisture from the received JSON
    const { temperature, moisture } = req.body;

    // Store the extracted data
    latestData = {
        temperature: temperature,
        moisture: moisture
    };

    res.send('Data received successfully');
});

// GET endpoint to retrieve latest temperature and moisture data
app.get('/latest-data', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    // Prepare response with only temperature and moisture
    const responseData = {
        temperature: latestData.temperature,
        moisture: latestData.moisture
    };

    res.json(responseData); // Return the latest received data as JSON
});

// Start the server to listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
