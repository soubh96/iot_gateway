const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Data = require('./models/dataModel'); // Import the Data model
const app = express();
const port = process.env.PORT || 3000;

const mongoURI = 'mongodb+srv://soubhikbaral4:eHBNqrCPu1DGNGdL@cluster0.nwqvj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());

let latestData = {}; // Store the latest received data

// POST endpoint to receive data
app.post('/receive-data', async (req, res) => {
    try {
        console.log('Received data:');
        console.log(req.body);

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

        parts.forEach(part => {
            if (part.includes('TEMPERATURE')) {
                temperature = parseFloat(part.split(':')[1]);
            }
            if (part.includes('MOISTURE')) {
                moisture = parseFloat(part.split(':')[1]);
            }
            if (part.includes('EC')) {
                electricalConductivity = parseFloat(part.split(':')[1]);
            }
            if (part.includes('NITROGEN')) {
                nitrogen = parseFloat(part.split(':')[1]);
            }
            if (part.includes('PHOSPHORUS')) {
                phosphorus = parseFloat(part.split(':')[1]);
            }
            if (part.includes('POTASSIUM')) {
                potassium = parseFloat(part.split(':')[1]);
            }
        });

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

        // Update or insert the data
        const updatedData = await Data.findOneAndUpdate({}, dataToStore, { upsert: true, new: true });
        latestData = updatedData;

        console.log('Stored latest data:');
        console.log(latestData);

        res.send('Data received successfully');
    } catch (error) {
        console.error('Error processing data:', error.message);
        res.status(400).send('Error processing data');
    }
});

// GET endpoint to retrieve latest data
app.get('/latest-data', async (req, res) => {
    try {
        const latestData = await Data.findOne().exec();
        res.setHeader('Content-Type', 'application/json');
        
        const responseData = {
            temperature: latestData?.temperature || 36,
            moisture: latestData?.moisture || 51,
            electricalConductivity: latestData?.electricalConductivity || 102,
            nitrogen: latestData?.nitrogen || 0,
            phosphorus: latestData?.phosphorus || 0,
            potassium: latestData?.potassium || 0
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error retrieving data:', error.message);
        res.status(500).send('Error retrieving data');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
