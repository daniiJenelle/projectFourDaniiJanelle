app = {};
app.chosenCityName = '';
app.userInput = '';

// AJAX METHODS START

// ajax call to get possible city names
app.getCityNames = function (cityName) {
  return $.ajax({
    url: `http://gd.geobytes.com/AutoCompleteCity`,
    method: 'GET',
    dataType: 'jsonp',
    headers: {
      "x-rapidapi-host": "devru-latitude-longitude-find-v1.p.rapidapi.com",
      "x-rapidapi-key": "9e16543852msh061f067cf4ff492p109400jsn392cd80914f3",
    },
    data: {
      q: cityName,
      sort: `size`
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
      apikey: 'HLfqldOiZiGuEbbAgh9M5aXYeE5TuoAA',
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
      format: 'json',
      units: 'metric'
    }
  });
};

// function for ajax call to get photo for location
app.getPhoto = function (cityName, countryName) {
  return $.ajax({
    url: `https://pixabay.com/api/`,
    method: `GET`,
    dataType: `json`,
    data: {
      key: `13477328-fc7c4133a7a5d2292102c1037`,
      q: `${cityName} ${countryName}`,
      image_type: `photo`,
      orientation: `horizontal`,
      min_width: `640`,
      min_height: `600`
    }
  })
}
// AJAX METHODS END

// METHODS START

// listen for what user is typing in the input to show as search hint
app.checkUserInput = function () {
  $('form').keyup(e => {
    app.userInput = $(`:text`).val();
    console.log(app.userInput)

    if (app.userInput.length <= 2 && e.key === 'Enter') {
      $('#searchHint').text(`Enter a city name with 3 or more letters`);
      $('#searchHint').addClass('showEl');
    } else if (app.userInput.length >= 3 && e.key !== 'Enter') {
      $('#searchHint').text(`Hit enter to search ${app.userInput}`);
      $('#searchHint').addClass('showEl');
    } else if (e.key !== 'Enter') {
      $('#searchHint').removeClass('showEl');
    }
  });

  app.formSubmit();
};

// listen for form submit when the user searches for a city name
app.formSubmit = function () {
  $('form').submit(e => {
    e.preventDefault();
    if (app.userInput.length >= 3) {
      app.searchCityAutocomplete(app.userInput);
    };
  });
}

// invokes search to returned city names which match search query
app.searchCityAutocomplete = async function (cityName) {
  try {
    let matchedCities = await app.getCityNames(cityName);
    console.log(matchedCities);

    if (matchedCities[0] === '' || matchedCities.length === 0) {
      console.log('city does not exist');
      $('#searchHint').text('No results found. Try again.');
      return
    }

    app.handleMatchedCities(matchedCities);

  } catch (error) {
    alert('⚠️ API is not working... so go home and sleep. 🔥')
  }
}

/// checks data from returned city names
app.handleMatchedCities = function (matchedCities) {
  if (matchedCities.length > 1) {
    $('#cityList').addClass('revealPopUp');
    // render all cities that matches user input to the DOM
    app.renderMatchedCitiesList(matchedCities);
    app.chooseCityFromList(matchedCities);
  } else {
    app.chosenCityName = matchedCities[0].replace(/,.*?,/, '').replace(/\(.*?\)/, '');
    console.log(app.chosenCityName);
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
    })[0].replace(/,.*?,/, '')

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
  app.latitude = chosenCityInfo[0].GeoPosition.Latitude;
  app.longitude = chosenCityInfo[0].GeoPosition.Longitude;
  app.timezone = chosenCityInfo[0].TimeZone.Code

  console.log(app.officialCityName, app.countryName, app.latitude, app.longitude, app.timezone);
  app.dashboardAPICalls(app.officialCityName, app.countryName, app.latitude, app.longitude, app.timezone);
}

// function to render News ajax call to the dashboard
app.displayNewsDashboard = function (news) {
  news.response.docs.forEach(function (article) {
    const articleTitle = article.headline.main
    const articleAbstract = article.abstract
    const articleLink = article.web_url
    const articleDate = new Date(article.pub_date);
    let articleImage = './styles/assets/images/newsImage.jpg'
    if (article.multimedia[0] != undefined && article.multimedia.length != 1) {
      articleImage = `https://www.nytimes.com/` + `${article.multimedia[0].url}`
    }

    $(`.news`).append(`<a href="${articleLink}" class="singleArticle"><img src="${articleImage}" alt=""><h3>${articleTitle}</h3><p>${articleDate.toDateString()}</p><p>${articleAbstract}</p></a>`);
  });
}

// function to render weather ajax call to the dashboard
app.displayWeatherDashboard = function (weather, timezone) {
  const weatherTitle = weather.weather[0].description
  const temperature = Math.round(weather.main.temp)
  console.log(weather.weather[0].icon)
  const weatherIcon = `./styles/assets/images/weatherIcons/${weather.weather[0].icon}.svg`
  const tempMin = Math.round(weather.main.temp_min)
  const tempMax = Math.round(weather.main.temp_max)
  console.log(timezone)
  const sunrise = new Date(weather.sys.sunrise * 1000)
  const sunset = new Date (weather.sys.sunset * 1000)
  console.log(sunrise)

  $(`.weather`).append(`<div><p class="temperature">${temperature}°C</p><p class="minMax">${tempMax} / ${tempMin}</p></div><div><h3>${weatherTitle}</h3><p>Sunrise: ${sunrise.toLocaleTimeString()}</p><p>Sunset: ${sunset.toLocaleTimeString()}</div><div><img class="weatherIcon" src="${weatherIcon}"></div>`)
}

// function to render time ajax call to the dashboard
app.displayTimeDashboard = function (time) {
  date = new Date(time.formatted)
  $(`.dateTime`).append(`<h3>local time: </h3><p>${date}</p>`);
}

// function to render photo ajax call to the dashboard
app.displayPhotoDashboard = function (photo) {
  const photoURL = photo.hits[0].webformatURL

  $(`.cityPhoto`).css(`background-image`, `url(${photoURL}`)
}

// function to retrieve news, time and weather objects and render to dashboard
app.dashboardAPICalls = async function (officialCityName, countryName, latitude, longitude, timezone) {
  const news = await app.getNews(officialCityName, countryName);
  const time = await app.getTimezone(latitude, longitude);
  const weather = await app.getWeather(latitude, longitude);
  const photo = await app.getPhoto(officialCityName, countryName);

  $(`.cityName h1`).append(`<p>${officialCityName}</p><p>${countryName}</p>`)

  app.displayNewsDashboard(news);
  app.displayWeatherDashboard(weather, timezone);
  app.displayTimeDashboard(time);
  app.displayPhotoDashboard(photo);
}

// INIT FUNCTION
app.init = function () {
  app.checkUserInput();
};

// DOCUMENT READY
$(function () {
  app.init()
});