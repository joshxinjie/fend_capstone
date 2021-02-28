var path = require('path')

// Start up an instance of app
const express = require('express')
const app = express();

const mockAPIResponse = require('./mockAPI.js')

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 8005;
const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME;
const WEATHERBIT_KEY = process.env.WEATHERBIT_KEY;
const PIXABAY_KEY = process.env.PIXABAY_KEY;

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

const fetch=require('node-fetch');

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'))
    // res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what PORT the app will listen to for incoming requests
app.listen(PORT, function () {
    console.log(`App listening on PORT ${PORT}!`)
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})

// app.post('/retrieveCoordinates', retrieveCoordinates);

app.post('/retrieveWeather', retrieveWeather);
function retrieveWeather(request, response) {
    let destination = request.body.destination;
    let arrivalDate = request.body.arrivalDate;
    let departureDate = request.body.departureDate;

    console.log(`Destination ${destination}`)
    console.log(`Arrival Date ${arrivalDate}`)
    console.log(`Departure Date ${departureDate}`)
}

// app.post('/retrieveImages', retrieveImages);