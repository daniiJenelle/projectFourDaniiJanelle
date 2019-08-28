// Create a form that has one input and a submit button. User must enter city name.

// Create an app object which stores properties and methods.

// Add an event listener for when form is submitted, to store city name within app object.

// Perform data sanitization to the submitted city and country name using.trim() and.toLowerCase().

// Error handling: if city name is misspelt and does not return anything from the database, show message that no results were found.

// Search result will return array of all city objects from City Geo-Location Lookup API

const getCityInfo = (cityName) => {
    return $.ajax({
        url: `NEED URL`,
        method: 'GET',
        dataType: 'json'
    });
};


//  API will return an array of results. If number of items in array is > 1, clear page and show a dropdown menu of possible cities. forEach function will be run on array to render each possible city reference that matches user's search query as items in a dropdown menu for user to select. 

// Add event listener to listen to submit after user has chosen an item in dropbdown menu to store information from the selected city's object into the above 4 declared variables

// If number of items is 1, then continue straight to city's dashboard page.


async function getData() {
    // information we need to store from the chosen object

    const chosenCity = await getCityInfo(cityName);
    const longitude = chosenCity.longitude;
    const latitude = `etc`;
    const cityName = ``;
    const countryCode = ``;

    const news = await getNews(cityName, countryCode);
    // Save the news we get back in an array (because there will be multiple news articles)
    // render the first 4 news stories within News section

    const currentDateAndTime = await getTime(longitude, latitude);
    // Store date and time as a string in a variable
    // render date and time within Date section

    const currentWeather = await getWeather(longitude, latitude);
    // Store weather conditions in a string/object (depending on how many things we get back)
    // render weather condition

    // RENDER THE ABOVE CONTENT TO THE DOM
}

// Call getData 
getData();


// RESOURCES 
// https://www.freecodecamp.org/news/avoiding-the-async-await-hell-c77a0fb71c4c/