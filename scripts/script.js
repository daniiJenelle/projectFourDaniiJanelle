app = {}

// function to render list of possible city name matches based on user input defined here
app.cityMenu = function () {
  $(`form`).on(`submit`, function (e) {
    e.preventDefault();
    const cityName = ($(`:text`).val());

    app.findCityAPICall(cityName);

  });
};

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

app.getNews = function (countryCode) {
  return $.ajax({
    url: `https://newsapi.org/v2/top-headlines`,
    method: 'GET',
    dataType: 'json',
    data: {
      apiKey: '5b261aba2f3f4717a9cae3d7c5dc07a8',
      country: countryCode
    }
  });
};

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

app.chosenCity = [];

app.findCityAPICall = async function (cityName) {
  // this will return an array of cities which matches the user input
  const cityInfo = await app.getCityInfo(cityName);

  const assignmentFunction = (chosenCity) => {
    app.placeName = chosenCity[0].name;
    app.countryCode = chosenCity[0].c;
    app.latitude = chosenCity[0].lat;
    app.longitude = chosenCity[0].lon;

    app.dashboardAPICalls(app.countryCode, app.latitude, app.longitude);
  }

  //if user input returns multiple city options, the following function will render 

  if (cityInfo.Results.length > 1) {
    // renders all cities that matches user input to the DOM
    cityInfo.Results.forEach((city) => {
      const liHTML = `<li>${city.name}</li>`

      $('.cityOptions').append(liHTML);
    });

    // listening for which matched city the user clicks on
    $('.cityOptions').on('click', 'li', function () {
      app.chosenCity = cityInfo.Results.filter((city) => {
        return city.name === $(this).text();
      })

      assignmentFunction(app.chosenCity);
    })
  } else {
    app.chosenCity = cityInfo.Results
    assignmentFunction(app.chosenCity);
  }

};

app.dashboardAPICalls = async function (countryCode, latitude, longitude) {
  console.log(countryCode);
  const news = await app.getNews(countryCode);
  const time = await app.getTimezone(latitude, longitude);
  const weather = await app.getWeather(latitude, longitude);
  console.log(news, time, weather)
}


app.init = function () {
  app.cityMenu();
};

$(function () {
  app.init()


});