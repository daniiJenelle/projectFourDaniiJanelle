app = {};
app.chosenCityName = '';
// app.chosenCityInfo = [];

// AJAX METHODS START

// ajax call to get possible city names
app.getCityNames = function (cityName) {
  return $.ajax({
    url: `http://gd.geobytes.com/AutoCompleteCity`,
    method: 'GET',
    dataType: 'jsonp',
    headers: {
      "x-rapidapi-host": "devru-latitude-longitude-find-v1.p.rapidapi.com",
      "x-rapidapi-key": "9e16543852msh061f067cf4ff492p109400jsn392cd80914f3"
    },
    data: {
      q: cityName
    }
  })
};

// ajax call to get information about city based on chosen city name
app.getCityInfo = function (chosenCity) {
  return $.ajax({
    url: `http://dataservice.accuweather.com/locations/v1/cities/search`,
    method: 'GET',
    dataType: 'json',
    data: {
      apikey: 'Jip3xwxEAw8IjDBc09F3cVCUABRgzrl6',
      q: chosenCity
    }
  });
}; // AJAX METHODS END

// METHODS START

// listen for what user is typing in the input to show as search hint
app.searchHint = function () {
  $('#citySearch').keyup(e => {
    const userInput = $('#citySearch').val();
    console.log(userInput.length);
    $('#searchHint').text(`hit enter to go to ${userInput}`);

    if (userInput.length > 2) {
      console.log('add class');
      $('#searchHint').addClass('showEl')
    } else {
      $('#searchHint').removeClass('showEl')
    }

  })
}

// listen for form submit when the user searches for a city name
app.formSubmit = function () {
  $(`form`).on(`submit`, function (e) {
    e.preventDefault();
    $('.cityOptions').empty();
    app.chosenCity = [];

    let cityName = ($(`:text`).val());
    app.searchCityAutocomplete(cityName)
  });
};

// invokes search to returned city names which match search query
app.searchCityAutocomplete = async function (cityName) {
  let matchedCities = await app.getCityNames(cityName);
  console.log('FRESHLY RETRIEVED DATA', matchedCities);
  app.handleMatchedCities(matchedCities);
};

// checks data from returned city names
app.handleMatchedCities = function (matchedCities) {
  if (matchedCities.length > 1) {
    // render all cities that matches user input to the DOM
    app.renderMatchedCitiesList(matchedCities);
    app.chooseCityFromList(matchedCities);
  } else {
    app.chosenCityName = matchedCities;
    app.searchHandleCityInfo(app.chosenCityName);
  }
}

// if more than 1 matched city, print list of cities on page that match user input
app.renderMatchedCitiesList = function (matchedCities) {
  matchedCities.forEach((city) => {
    const liHTML = `<li><a>${city}</a></li>`
    // prints each city as a list item on page
    $('.cityOptions').append(liHTML);
  })
}

// listen for which matched city the user clicks on
app.chooseCityFromList = function (matchedCities) {
  $('.cityOptions').on('click', 'li', function () {
    app.chosenCityName = matchedCities.filter((city) => {
      return city === $(this).text();
    });
    console.log('User has selected this city', app.chosenCityName)
    app.searchHandleCityInfo(app.chosenCityName);
    $('.cityOptions').off();
  });
}

// use chosen city to invoke search to retrieve city information
app.searchHandleCityInfo = async function (chosenCity) {
  let chosenCityInfo = await app.getCityInfo(chosenCity);
  console.log('Info of chosen city has been stored', chosenCityInfo);
  app.officialCityName = chosenCityInfo[0].EnglishName;
  app.countryName = chosenCityInfo[0].Country.EnglishName;
  app.countryCode = chosenCityInfo[0].Country.ID;
  app.latitude = chosenCityInfo[0].GeoPosition.Latitude;
  app.longitude = chosenCityInfo[0].GeoPosition.Longitude;

  console.log(app.officialCityName, app.countryName, app.countryCode, app.latitude, app.longitude);
}

// app.dashboardAPICalls(app.countryCode, app.latitude, app.longitude);

// INIT FUNCTION
app.init = function () {
  app.formSubmit();
  app.searchHint();
};

// DOCUMENT READY
$(function () {
  app.init()


});