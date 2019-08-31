const app = {};
app.chosenCity = [];

// function to render list of possible city name matches based on user input defined here
app.formSubmit = function () {
  $(`form`).on(`submit`, function (e) {
    e.preventDefault();
    $('.cityOptions').empty();
    app.chosenCity = [];

    let cityName = ($(`:text`).val());
    app.findCityAPICall(cityName);

  });
};

// function to determine the correct object that holds the city information which matches user search
app.findCityAPICall = async function (cityName) {
  // this will run ajax call and return an array of cities which matches the user input
  let cityInfo = await app.getCityInfo(cityName);
  console.log(`Freshly retrieved data`, cityInfo);
  app.handleCityInfo(cityInfo);
};

app.handleCityInfo = function (cityInfo) {
  cityInfo.Results.forEach((city) => {
    if (city.name.includes(`null`)) {
      city.name = city.name.replace(`(null)`, city.c)
    }
  });
  if (cityInfo.Results.length > 1) {
    // renders all cities that matches user input to the DOM
    app.renderCityList(cityInfo);
    app.chooseCityFromList(cityInfo);
  } else {
    app.chosenCity = cityInfo.Results
    assignmentFunction(app.chosenCity);
  }
}

// function to print list of cities on page that match user input
app.renderCityList = function (cityInfo) {
  cityInfo.Results.forEach((city) => {
    const liHTML = `<li><a>${city.name}</a></li>`
    // prints each city as a list item on page
    $('.cityOptions').append(liHTML);
  })
}

// function to listen for which matched city the user clicks on
app.chooseCityFromList = function (cityInfo) {
  $('.cityOptions').on('click', 'li', function () {
    app.chosenCity = cityInfo.Results.filter((city) => {
      return city.name === $(this).text();
    });
    console.log(app.chosenCity);
    assignmentFunction(app.chosenCity);
    $('.cityOptions').off();
  });
}

// assignment function to grab the needed properties from our chosen city object
const assignmentFunction = (chosenCity) => {
  app.placeName = chosenCity[0].name;
  app.countryCode = chosenCity[0].c;
  app.latitude = chosenCity[0].lat;
  app.longitude = chosenCity[0].lon;

  app.dashboardAPICalls(app.countryCode, app.latitude, app.longitude);
}

app.dashboardAPICalls = async function (cityName, latitude, longitude) {
  const news = await app.getNews(cityName);
  const time = await app.getTimezone(latitude, longitude);
  const weather = await app.getWeather(latitude, longitude);
  console.log(news, time, weather)
}

// function for ajax call to get information about city based on city name
app.getCityInfo = function (cityName) {
  return $.ajax({
    url: `https://devru-latitude-longitude-find-v1.p.rapidapi.com/latlon.php`,
    method: 'GET',
    dataType: 'json',
    headers: {
      "x-rapidapi-host": "devru-latitude-longitude-find-v1.p.rapidapi.com",
      "x-rapidapi-key": "9e16543852msh061f067cf4ff492p109400jsn392cd80914f3"
    },
    data: {
      location: cityName
    }
  });
};

// funtion for ajax call to get news based on country code

app.getNews = function (cityName) {
  return $.ajax({
    url: `https://api.nytimes.com/svc/search/v2/articlesearch.json`,
    method: 'GET',
    dataType: 'json',
    data: {
      'api-key': '25f7AaRW3nMz4B6VGWlyf69GrcGkw2Ee',
      q: cityName
    }
  });
};

// function for ajax call to get timezone information based on latitude and longitutde
app.getTimezone = function (latitude, longitude) {
  return $.ajax({
    url: `http://api.timezonedb.com/v2.1/get-time-zone`,
    method: 'GET',
    dataType: 'json',
    data: {
      key: '8EZVCD1H71OJ',
      format: 'json',
      by: 'position',
      lat: latitude,
      lng: longitude
    }
  });
};

// function for ajax call to get weather based on latitude and longitude
app.getWeather = function (latitude, longitude) {
  return $.ajax({
    url: `http://api.openweathermap.org/data/2.5/weather`,
    method: 'GET',
    dataType: 'json',
    data: {
      APPID: '1a8d4351dec8a304fba8b7b27b31933e',
      lat: latitude,
      lon: longitude,
      format: 'json'
    }
  });
};

// function to render ajax calls to the dashboard
// app.displayDashboard = function(article) {
//   $(`.news`).html(`${article.response.docs}`)
// }



app.init = function () {
  app.formSubmit();
};

$(function () {
  app.init()


});