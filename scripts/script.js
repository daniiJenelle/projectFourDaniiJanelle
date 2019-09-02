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
      q: `${cityName} ${countryName} city`,
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

    if (app.userInput.length <= 2 && e.key === 'Enter') {
      $('#searchHint').text(`enter a city name with 3 or more letters`);
      $('#searchHint').addClass('showHint');
    } else if (app.userInput.length >= 3 && e.key !== 'Enter') {
      $('#searchHint').text(`hit enter to search ${app.userInput}`);
      $('#searchHint').addClass('showHint');
    } else if (e.key !== 'Enter') {
      $('#searchHint').removeClass('showHint');
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

    if (matchedCities[0] === '' || matchedCities.length === 0) {
      console.log('city does not exist');
      $('#searchHint').text('no results found. try again.');
      return
    }

    setTimeout(() => {
      $('#searchHint').text('');
    }, 1000);

    $('header').addClass('changeBackground');
    $('#searchHint').removeClass('showHint');
    app.takeMeToAnimation();
    app.handleMatchedCities(matchedCities);

  } catch (error) {
    alert('⚠️ API is not working... so go home and sleep. 🔥')
  }
}

// animation for h1 to slide up
app.takeMeToAnimation = function () {
  const userInputLetters = app.userInput.split('')
  userInputLetters.unshift(' ');

  $('h1')[0].innerHTML = 'taking you to'

  userInputLetters.forEach(function (letter, index) {
    setTimeout(function () {
      $('h1')[0].innerHTML += letter;
    }, 100 * (index + 1));
  });

  setTimeout(() => {
    $('h1').addClass('shiftUp');
  }, 1000);
}

// checks data from returned city names
app.handleMatchedCities = function (matchedCities) {
  console.log(matchedCities)
  if (matchedCities.length > 1) {
    // render all cities that matches user input to the DOM
    app.renderMatchedCitiesList(matchedCities);
    app.chooseCityFromList(matchedCities);
  } else {
    app.chosenCityName = matchedCities[0].replace(/,.*?,/, '').replace(/\(.*?\)/, '').replace(/Korea, South/, '')
    console.log(app.chosenCityName);
    app.searchHandleCityInfo(app.chosenCityName);
  }
}

// if more than 1 matched city, print list of cities on page that match user input
app.renderMatchedCitiesList = function (matchedCities) {
  matchedCities.forEach((city) => {
    const liHTML = `<li><a href="#dashboard">${city}</a></li>`
    // prints each city as a list item on page
    $('.cityOptions').append(liHTML);
  });

  app.popUpModalAnimation();
}

// pop up modal that shows list of cities
app.popUpModalAnimation = function () {
  setTimeout(() => {
    $('#cityList').addClass('visibilityChange');
    $('.cityOptions').addClass('zoomIn').addClass('opacityChange');

    // listening for click on X to close the pop up modal
    $('#closeCross').click(() => {
      $('.cityOptions').removeClass('zoomIn').addClass('zoomOut').removeClass('opacityChange');
      $('#cityList').removeClass('visibilityChange');
      $('.cityOptions').html(`<a href="#" id="closeCross"><i class="far fa-times-circle"></i></a>`);
      $('#searchHint').text(`hit enter to search ${app.userInput}`);
      $('#searchHint').addClass('showHint');
      $('h1').removeClass('shiftUp');
      $('h1')[0].innerHTML = 'take me to';
      $('.cityOptions').removeClass('zoomOut');
    });
  }, 2000);
};

// listen for which matched city the user clicks on
app.chooseCityFromList = function (matchedCities) {
  $('.cityOptions').on('click', 'li', function () {
    app.chosenCityName = matchedCities.filter((city) => {
      return city === $(this).text();
    })[0].replace(/,.*?,/, '').replace(/\(.*?\)/, '');

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
  app.localOffset = chosenCityInfo[0].TimeZone.GmtOffset;
  app.timezone = chosenCityInfo[0].TimeZone.Code;
  console.log(app.timezone)

  console.log(app.officialCityName, app.countryName, app.latitude, app.longitude, app.localOffset);
  app.dashboardAPICalls(app.officialCityName, app.countryName, app.latitude, app.longitude, app.localOffset);
}

// smoothscroll function
app.smoothScroll = function() {
  $('.cityOptions').on('click', 'li', () => {
    $(`html`).animate({
      scrollTop: $(`#dashboard`).offset().top
    }, 800, function() {
        window.location.hash = `#dashboard`;
    });
  });
}

app.smoothScrollOneChoice = function () {
  $('form').submit( () => {
    $(`html`).animate({
      scrollTop: $(`#dashboard`).offset().top
    }, 800, function () {
      window.location.hash = `#dashboard`;
    });
  })
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
app.displayWeatherDashboard = function (weather, localOffset) {
  const weatherTitle = weather.weather[0].description
  const temperature = Math.round(weather.main.temp)
  console.log(weather.weather[0].icon)
  const weatherIcon = `./styles/assets/images/weatherIcons/${weather.weather[0].icon}.svg`
  const tempMin = Math.round(weather.main.temp_min)
  const tempMax = Math.round(weather.main.temp_max)
  const sunrise = new Date(weather.sys.sunrise * 1000)
  const sunset = new Date(weather.sys.sunset * 1000)
  console.log(sunrise)

  $(`.weather`).append(`<div><p class="temperature">${temperature}°C</p><p class="minMax">${tempMax} / ${tempMin}</p></div><div><h3>${weatherTitle}</h3><p>Sunrise: ${sunrise.toLocaleTimeString()}</p><p>Sunset: ${sunset.toLocaleTimeString()}</div><div><img class="weatherIcon" src="${weatherIcon}"></div>`)
}

// function to render time ajax call to the dashboard
app.displayTimeDashboard = function (time, localOffset) {
  const currentDate = new Date();
  const timezoneOffset = (currentDate.getTimezoneOffset())/60
  const timeDiff = (timezoneOffset + localOffset)
  const displayedTime = new Date(currentDate.setHours(currentDate.getHours() + timeDiff))
  console.log(new Date(displayedTime))

  $(`.dateTime`).append(`<h3>local time: </h3><p>${displayedTime.toDateString()}, ${displayedTime.toLocaleTimeString()}${app.timezone} (GMT+${timezoneOffset})</p>`);
}

// function to render photo ajax call to the dashboard
app.displayPhotoDashboard = function (photo) {
  const photoURL = photo.hits[0].largeImageURL

  $(`.cityPhoto`).css(`background-image`, `url(${photoURL}`)
}

// function to retrieve news, time and weather objects and render to dashboard
app.dashboardAPICalls = async function (officialCityName, countryName, latitude, longitude, localOffset) {
  const news = await app.getNews(officialCityName, countryName);
  const time = await app.getTimezone(latitude, longitude);
  const weather = await app.getWeather(latitude, longitude);
  let photo = await app.getPhoto(officialCityName, countryName);
  if (photo.hits == 0) {
    photo = await app.getPhoto('town', countryName);
  }

  $(`.cityName h1`).append(`<p>${officialCityName}</p><p>${countryName}</p>`)

  app.displayNewsDashboard(news);
  app.displayWeatherDashboard(weather, localOffset);
  app.displayTimeDashboard(time, localOffset);
  app.displayPhotoDashboard(photo);
}

// INIT FUNCTION
app.init = function () {
  app.checkUserInput();
  app.smoothScroll();
  app.smoothScrollOneChoice();
};

// DOCUMENT READY
$(function () {
  app.init()
});