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

    try {
        // Extract data from the received JSON payload
        const objectJSON= req.body.objectJSON;
        const parsedData=JSON.parse(objectJSON)
        const { mydata } = parsedData;

        // Split mydata string by '--' to separate temperature and moisture
        const parts = mydata.split('--');

        // Initialize variables to store temperature and moisture
        let temperature = NaN;
        let moisture = NaN;
        let electricalConductivity=NaN;

        // Iterate over parts to find and extract temperature and moisture values
        parts.forEach(part => {
            if (part.includes('TEMPERATURE')) {
                temperature = parseFloat(part.split(':')[1]);
            } else if (part.includes('MOISTURE')) {
                moisture = parseFloat(part.split(':')[1]);
            } else if (part.includes('EC')) {
                electricalConductivity = parseFloat(part.split(':')[1]);
            }
        });

        // Validate extracted data
        if (isNaN(temperature) || isNaN(moisture)|| isNaN(electricalConductivity)) {
            throw new Error('Invalid temperature,moisture or electricalConductivity data');
        }

        // Store the extracted data
        latestData = {
            temperature: temperature,
            moisture: moisture,
            electricalConductivity: electricalConductivity
        };

        console.log('Stored latest data:');
        console.log(latestData);

        res.send('Data received successfully');
    } catch (error) {
        console.error('Error processing data:', error.message);
        res.status(400).send('Error processing data');
    }
});

// GET endpoint to retrieve latest temperature and moisture data
app.get('/latest-data', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    // Prepare response with only temperature and moisture
    const responseData = {
        temperature: latestData.temperature || 0,
        moisture: latestData.moisture || 0,
        electricalConductivity: latestData.electricalConductivity || 0

    };

    res.json(responseData); // Return the latest received data as JSON
});

// Start the server to listen on all available network interfaces
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
