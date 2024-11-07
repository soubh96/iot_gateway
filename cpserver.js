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
        let nitrogen = NaN;
        let phosphorus = NaN;
        let potassium = NaN;

        // Check for each data field and update if present
        parts.forEach(part => {
            if (part.includes('T')) {
                temperature = parseFloat(part.split(':')[1]);
            }
            if (part.includes('H')) {
                moisture = parseFloat(part.split(':')[1]);
            }
            if (part.includes('EC')) {
                electricalConductivity = parseFloat(part.split(':')[1]);
            }
            if (part.includes('N')) {
                nitrogen = parseFloat(part.split(':')[1]);
            }
            if (part.includes('P')) {
                phosphorus = parseFloat(part.split(':')[1]);
            }
            if (part.includes('K')) {
                potassium = parseFloat(part.split(':')[1]);
            }
        });

        // Store values only if they are valid numbers
        let dataToStore = {};

        if (!isNaN(temperature)) {
            dataToStore.temperature = temperature;
        }
        if (!isNaN(moisture)) {
            dataToStore.moisture = moisture;
        }
        if (!isNaN(electricalConductivity)) {
            dataToStore.electricalConductivity = electricalConductivity;
        }
        if (!isNaN(nitrogen)) {
            dataToStore.nitrogen = nitrogen;
        }
        if (!isNaN(phosphorus)) {
            dataToStore.phosphorus = phosphorus;
        }
        if (!isNaN(potassium)) {
            dataToStore.potassium = potassium;
        }

        if (Object.keys(dataToStore).length === 0) {
            throw new Error('No valid data to store');
        }

        latestData = dataToStore;

        console.log('Stored latest data:');
        console.log(latestData);

        res.send('Data received successfully');
    } catch (error) {
        console.error('Error processing data:', error.message);
        res.status(400).send('Error processing data');
    }
});

// GET endpoint to retrieve latest data
app.get('/latest-data', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    const responseData = {
        temperature: latestData.temperature || 36,
        moisture: latestData.moisture || 51,
        electricalConductivity: latestData.electricalConductivity || 102,
        nitrogen: latestData.nitrogen || 6,
        phosphorus: latestData.phosphorus || 8,
        potassium: latestData.potassium || 17
    };

    res.json(responseData);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
