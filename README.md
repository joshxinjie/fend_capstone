# FEND Capstone

## Website URL

https://fsnd-travel-capstone.herokuapp.com/

## Introduction

This project involve building a custom travel application. It includes a simple form where
 you enter the location you are traveling to and the date you are leaving. It will return 
the current weather of the location if the departure date is on the same day, or the weather 
forecast of the arrival date if the arrival date is with 16 days of the day of search. If the 
arrival date is more than 16 days away, it will return the last available weather forecast. 
Finally, the application will also return images of the location if applicable.

Data will be pulled from the following APIs:
1. Weatherbit API: Current weather and weather forecast of location
2. Geonames API: Coordinates of location
3. Pixabay API: Images of location

## How to Run

### Install Project Dependencies

Run the following command in a terminal in the root directory of the project

```
npm install
```

### Create the Environment File

Create an `.env` file at the root of the repository

```
GEONAMES_USERNAME=
WEATHERBIT_KEY=
PIXABAY_KEY=
PORT=7500
```

### Development Server

Run the following command in a terminal in the root directory of the project

```
npm run build-dev
```

You will automatically be directed to a page at http://localhost:8000/

In another terminal, run the command:

```
npm start
```

### Production Server

Run the following commands in a terminal in the root directory of the project:

```
npm run build-prod
```

```
npm start
```

Go to http://localhost:7500/

### Test

Make sure the production server is not running. Run the following command in a terminal in the root directory of the project:

```
npm run test
```

## Extension to Project

* Incorporate icons into forecast.
