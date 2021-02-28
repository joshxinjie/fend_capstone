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
    console.log(`Destination: ${destination}`);
    console.log(`Arrival Date: ${arrivalDate}`);
    console.log(`Departure Date: ${departureDate}`);

    retrieveDestinationWeather(destination, arrivalDate, departureDate);
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

function retrieveDestinationWeather(dest, arrDate, depDate) {
    // let postURL = `${window.location.origin}/retrieveWeather`;
    let postURL = 'http://localhost:7500/retrieveWeather';
    let destData = {destination: dest, arrivalDate: arrDate, departureDate: depDate};
    postDestination(postURL, destData);
}

function retrieveDestinationImages() {

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

export { handleSearch };