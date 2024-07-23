const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());

let latestData = {}; // Store the latest received data

// POST endpoint to receive data
app.post('/receive-data', (req, res) => {
    console.log('Received data:');
    console.log(req.body);

    // Extract data from the received JSON payload
    const { objectJSON } = req.body.payload;
    const { mydata } = JSON.parse(objectJSON);

    // Extract temperature and moisture from mydata string
    const [, temperatureStr, moistureStr] = mydata.split('-->');

    // Convert temperature and moisture to numbers
    const temperature = parseFloat(temperatureStr);
    const moisture = parseFloat(moistureStr);

    // Store the extracted data
    latestData = {
        temperature: temperature,
        moisture: moisture
    };
    console.log('stored latest data');
    console.log(latestData);
    res.send('Data received successfully');
});

// GET endpoint to retrieve latest temperature and moisture data
app.get('/latest-data', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    // Prepare response with only temperature and moisture
    const responseData = {
        temperature: latestData.temperature || 0,
        moisture: latestData.moisture || 0
    };

    res.json(responseData); // Return the latest received data as JSON
});

// Start the server to listen on all available network interfaces
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
