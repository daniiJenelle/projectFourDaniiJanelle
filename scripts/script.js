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
}; 

// funtion for ajax call to get news based on country code
app.getNews = function (cityName, countryName) {
  return $.ajax({
    url: `https://api.nytimes.com/svc/search/v2/articlesearch.json`,
    method: 'GET',
    dataType: 'json',
    data: {
      'api-key': '25f7AaRW3nMz4B6VGWlyf69GrcGkw2Ee',
      q: cityName,
      q: countryName
    }
  });
};

// function for ajax call to get timezone information based on latitude and longitutde
// app.getTimezone = function (latitude, longitude) {
//   return $.ajax({
//     url: `http://api.timezonedb.com/v2.1/get-time-zone`,
//     method: 'GET',
//     dataType: 'json',
//     data: {
//       key: '8EZVCD1H71OJ',
//       format: 'json',
//       by: 'position',
//       lat: latitude,
//       lng: longitude
//     }
//   });
// };

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
      format: 'json',
      units: 'metric'
    }
  });
}; // AJAX METHODS END

// METHODS START

// listen for what user is typing in the input to show as search hint
app.searchHint = function () {
  $('#citySearch').keyup(e => {
    const userInput = $('#citySearch').val();
    $('#searchHint').text(`hit enter to go to ${userInput}`);
    if (userInput.length > 2) {
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
  console.log(chosenCityInfo);
  console.log('Info of chosen city has been stored');
  app.officialCityName = chosenCityInfo[0].EnglishName;
  app.countryName = chosenCityInfo[0].Country.EnglishName;
  // app.countryCode = chosenCityInfo[0].Country.ID;
  app.latitude = chosenCityInfo[0].GeoPosition.Latitude;
  app.longitude = chosenCityInfo[0].GeoPosition.Longitude;

  console.log(app.officialCityName, app.latitude, app.longitude);
  app.dashboardAPICalls(app.officialCityname, app.countryName, app.latitude, app.longitude);
}

// function to render News ajax call to the dashboard
app.displayNewsDashboard = function (news) {
  news.response.docs.forEach(function (article) {
    const articleTitle = article.headline.main
    const articleAbstract = article.abstract
    const articleImage = `https://www.nytimes.com/` + `${article.multimedia[0].url}`
    const articleLink = article.web_url
  $(`.news`).append(`<a href="${articleLink}" class="singleArticle"><img src="${articleImage}" alt=""><h3>${articleTitle}</h3><p>${articleAbstract}</p></a>`);
  });
}

// function to render weather ajax call to the dashboard
app.displayWeatherDashboard = function (weather) {
  const weatherTitle = weather.weather[0].main
  const weatherDescription = weather.weather[0].description
  const temperature = Math.round(weather.main.temp)
  const weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  const tempMin = Math.round(weather.main.temp_min)
  const tempMax = Math.round(weather.main.temp_max)

  $(`.weather`).append(`<div><p>${temperature} °</p></div><div><p>${weatherTitle}</p><p>${weatherDescription}</p><p>${tempMin}</p><p>${tempMax}</p></div><div><img src="${weatherIcon}"></div>`)
}

// function to render time ajax call to the dashboard
app.displayTimeDashboard = function (time) {
  const date = new Date(time.dt * 1000);
  // Hours part from the timestamp
  // const hours = date.getHours();
  // // Minutes part from the timestamp
  // const minutes = "0" + date.getMinutes();
  // // Seconds part from the timestamp
  // const seconds = "0" + date.getSeconds();
  // console.log(date, hours, minutes, seconds);
  $(`.dateTime`).append(`${date}`);
}

// function to retrieve news, time and weather objects and render to dashboard
app.dashboardAPICalls = async function (officialCityName, countryName, latitude, longitude) {
  const news = await app.getNews(officialCityName, countryName);
  // const time = await app.getTimezone(latitude, longitude);
  const weather = await app.getWeather(latitude, longitude);

  $(`.cityName h1`).append(`<p>${app.officialCityName}</p><p>${app.countryName}</p>`)
  
  app.displayNewsDashboard(news);
  app.displayWeatherDashboard(weather);
  app.displayTimeDashboard(weather);
}

// INIT FUNCTION
app.init = function () {
  app.formSubmit();
  app.searchHint();
};

// DOCUMENT READY
$(function () {
  app.init()


});