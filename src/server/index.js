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

// console.log(__dirname)

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

const retrieveDestinationData = async(request, response) => {
    let destination = request.body.destination;
    let arrivalDate = request.body.arrivalDate;
    let departureDate = request.body.departureDate;

    // console.log(`Destination ${destination}`)
    // console.log(`Arrival Date ${arrivalDate}`)
    // console.log(`Departure Date ${departureDate}`)

    try {
        // get geo coordinates and country name
        const coordAndCountryName = await getCoordAndCountryName(destination, response);
        //  get days to arrival
        const daysToArrival = await getDaysToArrival(arrivalDate);
        console.log("Days to Arr", daysToArrival);
        // get weather
        // weather = { 
        //     weather: [{description: "Clear sky", iconURL: "https://www.weatherbit.io/static/img/icons/c01d", temp: 1}, {description, ...}]
        // }
        const weather = await getWeather(coordAndCountryName.lat, coordAndCountryName.lng, daysToArrival, response);
        // console.log("Weather", weather);
        const images = await getPhoto(destination, response, 3);
        // console.log("Images", images);
        const destinationData = {weather: weather, images: images, daysToArrival: daysToArrival};
        console.log("destinationData", destinationData);
        response.send(destinationData);
    } catch(error) {
        console.log("error", error);
    }
};
app.post('/retrieveDestinationData', retrieveDestinationData);

const getCoordAndCountryName = async(destination, response) => {
    const geoNamesURL = `http://api.geonames.org/searchJSON?maxRows=1&q=${destination}&username=${GEONAMES_USERNAME}`;

    const res = await fetch(geoNamesURL);

    try {
        const cityData = await res.json();
        const topCityData = cityData.geonames[0];
        const coordAndCountryNameData = {lat: topCityData.lat, lng: topCityData.lng, countryName: topCityData.countryName};
        return coordAndCountryNameData;
    } catch(error) {
        console.log("error", error);
    }
}

//  get days to arrival
const getDaysToArrival = async(arrivalDateStr) => {
    const numMillisecondsInADay = 1000*60*60*24;
    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);
    console.log("Today's Date", todayDate);

    let arrivalDate = new Date(arrivalDateStr);

    let daysToArrival = (arrivalDate - todayDate) / numMillisecondsInADay;
    
    daysToArrival = Math.floor(daysToArrival);

    return daysToArrival;
}

//  If the trip is within a week, you will get the current weather forecast. If the trip is in the future, you will get a predicted forecast
const getWeather = async(lat, lng, daysToArrival, response) => {
    const weatherbitCurrentURL = `http://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${WEATHERBIT_KEY}`
    const weatherbitForecastURL = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${WEATHERBIT_KEY}`

    let fetchURL = "";

    if (daysToArrival < 0) {
        console.log("Please enter an arrival date from today onwards");
    } else if (daysToArrival < 8) {
        // get current weather
        fetchURL = weatherbitCurrentURL;
    } else {
        fetchURL = weatherbitForecastURL;
    }

    const res = await fetch(fetchURL);

    try {
        const weatherResults = await res.json();
        // console.log("Fetched", weatherResults);
        // build array of json from all indices in weatherData
        weatherSummaryArray = buildWeatherSummaryJSON(weatherResults);
        // const weatherSummaryJSON = { weather: weatherSummaryArray };
        return weatherSummaryArray;
    } catch(error) {
        console.log("error", error);
    }
}

// weather text description, icon, temp
function buildWeatherSummaryJSON(weatherResultsJSON) {
    let weatherResultsArray = weatherResultsJSON.data;
    let weatherForecastSummaryArray = [];
    for (day in weatherResultsArray) {
        let dailyWeather = weatherResultsArray[day];
        let description = dailyWeather.weather.description;
        let icon = dailyWeather.weather.icon;
        let date = dailyWeather.datetime;
        // remove time from date if any
        if (date.includes(":")) {
            date = date.substr(0, date.indexOf(':'));
        }
        let iconURL = `https://www.weatherbit.io/static/img/icons/${icon}`;
        let temp = dailyWeather.temp;
        let dailyWeatherSummary = {
            description: description,
            iconURL: iconURL,
            temp: temp,
            date: date
        }
        weatherForecastSummaryArray.push(dailyWeatherSummary);
    }
    return weatherForecastSummaryArray
}

const getPhoto = async(destination, response, topK = 3) => {
    const pixabayURL = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${destination}&image_type=photo&orientation=horizontal&category=travel&safesearch=true`;

    const res = await fetch(pixabayURL);

    try {
        const photoData = await res.json();
        const topKImages = buildTopKPhotoArray(photoData, 3);
        return topKImages;
    } catch(error) {
        console.log("error", error);
    }
}

function buildTopKPhotoArray(pixabayResultsJSON, topK) {
    let imagesURLsArray = []
    const imagesResults = pixabayResultsJSON.hits;
    for (i = 0; i < topK; i++) {
        let imageResult = imagesResults[i];
        let imageURLs = {
            webFormatURL: imageResult.webformatURL,
            largeImageURL: imageResult.largeImageURL
        }
        imagesURLsArray.push(imageURLs);
    }
    return imagesURLsArray
}