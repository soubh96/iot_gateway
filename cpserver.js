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
        const objectJSON = req.body.objectJSON;
        console.log('Raw objectJSON:', objectJSON);
        const parsedData = JSON.parse(objectJSON);
        const { mydata } = parsedData;

        const parts = mydata.split('--');
        console.log('Split parts:', parts);

        let temperature = NaN;
        let moisture = NaN;
        let electricalConductivity = NaN;

        parts.forEach(part => {
            if (part.includes('TEMPERATURE')) {
                temperature = parseFloat(part.split(':')[1]);
            } else if (part.includes('MOISTURE')) {
                moisture = parseFloat(part.split(':')[1]);
            } else if (part.includes('EC')) {
                electricalConductivity = parseFloat(part.split(':')[1]);
            }
        });

        console.log('Extracted temperature:', temperature);
        console.log('Extracted moisture:', moisture);
        console.log('Extracted electricalConductivity:', electricalConductivity);

        if (isNaN(temperature) || isNaN(moisture) || isNaN(electricalConductivity)) {
            throw new Error('Invalid temperature, moisture, or electricalConductivity data');
        }

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
    
    const responseData = {
        temperature: latestData.temperature || 36,
        moisture: latestData.moisture || 51,
        electricalConductivity: latestData.electricalConductivity || 102
    };

    res.json(responseData);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

