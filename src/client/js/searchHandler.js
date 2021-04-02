// Add EventListener for click to search button
// document.getElementById("search-button").addEventListener("click", retrieveData);

// const envVariables = process.env;
// console.log(envVariables.PORT);

function handleSearch(event) {
    let destination = document.getElementById("search-destination").value;
    const arrivalDate = document.getElementById("arrival-date").value;
    const departureDate = document.getElementById("departure-date").value;

    checkMissingInputs(destination, arrivalDate, departureDate);

    destination = destination.toLowerCase().trim();
    // console.log(`Destination: ${destination}`);
    // console.log(`Arrival Date: ${arrivalDate}`);
    // console.log(`Departure Date: ${departureDate}`);

    retrieveDestinationData(destination, arrivalDate, departureDate);
}

function checkMissingInputs(destination, arrivalDate, departureDate) {
    if (destination == "") {
        alert("Please enter a valid destination!");
    }
    if (arrivalDate == "") {
        alert("Please enter a valid arrival date");
    }
    if (departureDate == "") {
        alert("Please enter a valid departure date");
    } 
}

// function retrieveDestinationData(dest, arrDate, depDate) {
//     // let postURL = `${window.location.origin}/retrieveWeather`;
//     let postURL = 'http://localhost:7500/retrieveDestinationData';
//     let destData = {destination: dest, arrivalDate: arrDate, departureDate: depDate};
//     postDestination(postURL, destData);
// }

function retrieveDestinationData(dest, arrDate, depDate) {
    // let postURL = `${window.location.origin}/retrieveWeather`;
    let postURL = 'http://localhost:7500/retrieveDestinationData';
    let destData = {destination: dest, arrivalDate: arrDate, departureDate: depDate};
    postDestination(postURL, destData)
    .then(response => updateUI(response));
}

const postDestination = async(url='', data={}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        console.log("New Data", newData);
        return newData;
    } catch(error) {
        console.log("error", error);
    }
};

function updateUI(destinationData) {
    const weatherData = destinationData.weather;
    const imagesData = destinationData.images;

    try {
        document.getElementById('carousel-obj').style.display = "block";
        const first_image_url = imagesData[0].webFormatURL;
        const second_image_url = imagesData[1].webFormatURL;
        const third_image_url = imagesData[2].webFormatURL;
        document.getElementById('carousel__slide1').style.backgroundImage = `url('${first_image_url}')`;
        document.getElementById('carousel__slide2').style.backgroundImage = `url('${second_image_url}')`;
        document.getElementById('carousel__slide3').style.backgroundImage = `url('${third_image_url}')`;
    } catch(error) {
        console.log("error", error);
    }
};

export { handleSearch };