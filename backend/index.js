const express = require('express');
const weather = require('weather-js');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Setup
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'weatherforecast';
const collectionName = 'weatherdata';
const client = new MongoClient(url);

// Connect to MongoDB
async function connectMongo() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
}

connectMongo();

// Endpoint: POST /weather
// User must send a JSON body: { "location": "Berlin" }
app.post('/weather', async (req, res) => {
  const { location } = req.body;

  if (!location) {
    return res.status(400).json({ error: 'Please provide a location.' });
  }

  weather.find({ search: location, degreeType: 'C', lang: 'en-US' }, async (err, result) => {
    if (err) {
      console.error('Weather-js Error:', err);
      return res.status(500).json({ error: 'Error fetching weather data.' });
    }

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'No weather data found for this location.' });
    }

    const weatherData = {
      location: result[0].location.name,
      current: result[0].current,
      forecast: result[0].forecast,
      fetchedAt: new Date()
    };

    try {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Insert weather data into MongoDB
      await collection.insertOne(weatherData);

      res.json(weatherData);
    } catch (mongoErr) {
      console.error('MongoDB Insert Error:', mongoErr);
      res.status(500).json({ error: 'Error saving data to database.' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});