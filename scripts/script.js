app = {};
app.chosenCityName = "";
app.userInput = "";
app.isLoading = false;

// AJAX METHODS START

// ajax call to get possible city names
app.getCityNames = function(cityName) {
  return $.ajax({
    url: "https://proxy.hackeryou.com",
    dataType: "json",
    method: "GET",
    data: {
      reqUrl: `http://gd.geobytes.com/AutoCompleteCity`,
      params: {
        q: cityName,
        sort: `size`
      },
      proxyHeaders: {
        "x-rapidapi-host": "devru-latitude-longitude-find-v1.p.rapidapi.com",
        "x-rapidapi-key": "9e16543852msh061f067cf4ff492p109400jsn392cd80914f3"
      },
      xmlToJSON: false,
      useCache: false
    }
  });
};

// ajax call to get information about city based on chosen city name
app.getCityInfo = function(chosenCity) {
  return $.ajax({
    url: "https://proxy.hackeryou.com",
    dataType: "json",
    method: "GET",
    data: {
      reqUrl: `http://dataservice.accuweather.com/locations/v1/cities/search`,
      params: {
        apikey: "ujcBYMnU2VPMzAfF7kSyzCDUe4lkHJqH ",
        q: chosenCity
      },
      xmlToJSON: false,
      useCache: false
    }
  });
};

// funtion for ajax call to get news based on country code
app.getNews = function(cityName, countryName) {
  return $.ajax({
    url: "https://proxy.hackeryou.com",
    dataType: "json",
    method: "GET",
    data: {
      reqUrl: `https://api.nytimes.com/svc/search/v2/articlesearch.json`,
      params: {
        "api-key": "25f7AaRW3nMz4B6VGWlyf69GrcGkw2Ee",
        q: cityName,
        q: countryName
      },
      xmlToJSON: false,
      useCache: false
    }
  });
};

// function for ajax call to get timezone information based on latitude and longitutde
app.getTimezone = function(latitude, longitude) {
  return $.ajax({
    url: "https://proxy.hackeryou.com",
    dataType: "json",
    method: "GET",
    data: {
      reqUrl: `http://api.timezonedb.com/v2.1/get-time-zone`,
      params: {
        key: "8EZVCD1H71OJ",
        format: "json",
        by: "position",
        lat: latitude,
        lng: longitude
      },
      xmlToJSON: false,
      useCache: false
    }
  });
};

// function for ajax call to get weather based on latitude and longitude
app.getWeather = function(latitude, longitude) {
  return $.ajax({
    url: "https://proxy.hackeryou.com",
    dataType: "json",
    method: "GET",
    data: {
      reqUrl: `http://api.openweathermap.org/data/2.5/weather`,
      params: {
        APPID: "ee717ae701d6c96b1d1fd0bb9b3077ec",
        lat: latitude,
        lon: longitude,
        format: "json",
        units: "metric"
      },
      xmlToJSON: false,
      useCache: false
    }
  });
};

// function for ajax call to get photo for location
app.getPhoto = function(cityName, countryName) {
  return $.ajax({
    url: "https://proxy.hackeryou.com",
    dataType: "json",
    method: "GET",
    data: {
      reqUrl: `https://pixabay.com/api/`,
      params: {
        key: `13477328-fc7c4133a7a5d2292102c1037`,
        q: `${cityName} ${countryName} city landscape`,
        image_type: `photo`,
        orientation: `horizontal`,
        min_width: `640`,
        min_height: `600`
      },
      xmlToJSON: false,
      useCache: false
    }
  });
};

// AJAX METHODS END

// METHODS START

// listen for what user is typing in the input to show as search hint
app.checkUserInput = function() {
  $("form").keyup(e => {
    app.userInput = $(`:text`)
      .val()
      .toLowerCase();
    $("#searchHint").text(`hit enter to search ${app.userInput}`);

    if (app.userInput.length <= 2 && e.key === "Enter") {
      $("#screenReaderFormFeedback").text(
        `enter a city name with 3 or more letters`
      );
      $("#searchHint").text(`enter a city name with 3 or more letters`);
      $("#searchHint").addClass("showHint");
    } else if (app.userInput.length >= 3 && e.key !== "Enter") {
      $("#searchHint").text(`hit enter to search ${app.userInput}`);
      $("#searchHint").addClass("showHint");
    } else if (e.key !== "Enter") {
      $("#searchHint").removeClass("showHint");
    }
  });

  app.formSubmit();
};

// listen for form submit when the user searches for a city name
app.formSubmit = function() {
  $("form").submit(e => {
    e.preventDefault();
    if (app.userInput.length >= 3) {
      app.searchCityAutocomplete(app.userInput);
      $("#citySearch").blur();
    }
  });
};

// invokes search to returned city names which match search query
app.searchCityAutocomplete = async function(cityName) {
  try {
    let matchedCities = await app.getCityNames(cityName);

    if (matchedCities[0] === "" || matchedCities.length === 0) {
      $("#screenReaderFormFeedback").text(
        "no results found. please check spelling or try another city."
      );
      $("#searchHint").text("no results found. try again.");
      $("#searchHint").addClass("shake");
      $("#searchHint").one(
        "webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function(e) {
          $("#searchHint").removeClass("shake");
        }
      );
      $("#searchCity").focus();
      return;
    } else if (matchedCities.length > 1) {
      app.takeMeToLetterTypingAnimation();
    } else if (matchedCities.length === 1) {
      $("h1")[0].innerHTML = "taking you to";
    }

    $("#searchHint").removeClass("showHint");
    setTimeout(() => {
      $("#searchHint").text("");
    }, 500);

    app.handleMatchedCities(matchedCities);
  } catch (error) {
    alert("⚠️ city autocomplete API failed to retrieve city names 🔥");
  }
};

// animation for h1 to slide up
app.takeMeToLetterTypingAnimation = function() {
  const userInputLetters = app.userInput.split("");
  userInputLetters.unshift(" ");

  $("h1")[0].innerHTML = "taking you to";

  userInputLetters.forEach(function(letter, index) {
    setTimeout(function() {
      $("h1")[0].innerHTML += letter;
    }, 100 * (index + 1));
  });

  setTimeout(() => {
    $("h1").addClass("shiftUp");
  }, 1000);
};

// checks data from returned city names
app.handleMatchedCities = function(matchedCities) {
  if (matchedCities.length > 1) {
    // render all cities that matches user input to the DOM
    app.renderMatchedCitiesList(matchedCities);
    app.chooseCityFromList(matchedCities);
  } else {
    app.chosenCityName = matchedCities[0]
      .replace(/,.*?,/, "")
      .replace(/\(.*?\)/, "")
      .replace(/Korea, South/, "");
    app.searchHandleCityInfo(app.chosenCityName);
    // app.smoothScrollOneChoice();
  }
};

// if more than 1 matched city, print list of cities on page that match user input
app.renderMatchedCitiesList = function(matchedCities) {
  matchedCities.forEach(city => {
    const liHTML = `<li><a>${city}</a></li>`;
    // prints each city as a list item on page
    $(".cityList").append(liHTML);
  });
  app.popUpModalAnimation();
};

// pop up modal that shows list of cities
app.popUpModalAnimation = function() {
  setTimeout(() => {
    $("#cityPopUp").addClass("visibilityChange");
    $(".cityList")
      .addClass("zoomIn")
      .addClass("opacityChange");
    $("#citySearchForm").css("opacity", "0");

    setTimeout(() => {
      $("#closeX").addClass("zoomIn");
    }, 500);

    // listening for click on X to close the pop up modal
    $("#closeX").click(() => {
      $(".cityList")
        .removeClass("zoomIn")
        .addClass("zoomOut")
        .removeClass("opacityChange");
      $("#cityPopUp").removeClass("visibilityChange");
      $(".cityList").empty();
      $("h1").removeClass("shiftUp");
      $("h1")[0].innerHTML = "take me to";
      $("#citySearchForm")
        .delay(1500)
        .css("opacity", "1");
      $(".cityList").removeClass("zoomOut");
      $("#closeX").removeClass("zoomIn");
      $("#searchHint").text(`hit enter to search ${app.userInput}`);
      $("#searchHint").addClass("showHint");
      $("#citySearch").focus();
    });
  }, 1400);
};

// listen for which matched city the user clicks on
app.chooseCityFromList = function(matchedCities) {
  $(".cityList").on("click", "li", function() {
    $(this)
      .children("a")
      .blur();
    $("#closeX").removeClass("zoomIn");
    $(".cityList li:not(.selectedCity)").addClass("fadeOutCity");

    setTimeout(() => {
      $(this).addClass("selectedCity");
      $(".cityList li:not(.selectedCity)").css("display", "none");
    }, 300);

    $(".cityList").addClass("fadeBlack");
    $("h1").text("taking you to");
    $("h1")
      .removeClass("shiftUp")
      .addClass("transparent");

    app.chosenCityName = matchedCities
      .filter(city => {
        return city === $(this).text();
      })[0]
      .replace(/,.*?,/, "")
      .replace(/\(.*?\)/, "");

    app.searchHandleCityInfo(app.chosenCityName);
    $(".cityList").off();

    // RESET FORM
    setTimeout(() => {
      $("h1")[0].innerHTML = "take me to";
      $("#cityList").empty();
      $("#cityPopUp").removeClass("visibilityChange");
      $("#citySearchForm").css("opacity", "1");
      $("#searchHint").text("search for another city");
      $("#searchHint").addClass("showHint");
    }, 3500);
  });
};

// use chosen city to invoke search to retrieve city information
app.searchHandleCityInfo = async function(chosenCity) {
  try {
    let chosenCityInfo = await app.getCityInfo(chosenCity);
    app.officialCityName = chosenCityInfo[0].EnglishName;
    app.countryName = chosenCityInfo[0].Country.EnglishName;
    app.latitude = chosenCityInfo[0].GeoPosition.Latitude;
    app.longitude = chosenCityInfo[0].GeoPosition.Longitude;
    app.localOffset = chosenCityInfo[0].TimeZone.GmtOffset;
    app.timezone = chosenCityInfo[0].TimeZone.Name;

    app.dashboardAPICalls(
      app.officialCityName,
      app.countryName,
      app.latitude,
      app.longitude,
      app.localOffset
    );
  } catch (error) {
    alert("⚠️ failed to retrieve information about cities from city API 🔥");
  }
};

// smoothscroll function for user making choice from city list
app.smoothScroll = function() {
  $(`html`).animate(
    {
      scrollTop: $(`#dashboard`).offset().top
    },
    1200
  );
};

// function to clear hash on refresh
app.clearHash = function() {
  window.addEventListener("load", () => {
    location.hash = ``;
  });
};

// function to render News ajax call to the dashboard
app.displayNewsDashboard = function(news) {
  $(`.news`).html(
    `<h4>local headlines</h4> <div class="newsArticleContainer"></div>`
  );

  news.response.docs.forEach(function(article) {
    const articleTitle = article.headline.main;
    const articleAbstract = article.abstract;
    const articleLink = article.web_url;
    const articleDate = new Date(article.pub_date);
    let articleImage = "./styles/assets/images/newsImage.jpg";
    if (article.multimedia[0] != undefined && article.multimedia.length != 1) {
      articleImage =
        `https://www.nytimes.com/` + `${article.multimedia[0].url}`;
    }

    $(`.newsArticleContainer`).append(
      `<a href="${articleLink}" title="click to read more" class="singleArticle"><div class="articleImage"><img src="${articleImage}" alt=""></div><h5>${articleTitle}</h5><p class="articleDate">${articleDate.toDateString()}</p><p class="articleAbstract">${articleAbstract}</p></a>`
    );
  });
};

// function to render weather ajax call to the dashboard
app.displayWeatherDashboard = function(weather, localOffset) {
  const weatherTitle = weather.weather[0].description;
  const temperature = Math.round(weather.main.temp);
  const weatherIcon = `./styles/assets/images/weatherIcons/${weather.weather[0].icon}.svg`;
  const tempMin = Math.round(weather.main.temp_min);
  const tempMax = Math.round(weather.main.temp_max);
  const sunrise = new Date(weather.sys.sunrise * 1000);
  const sunset = new Date(weather.sys.sunset * 1000);

  $(`.weather`).html(
    `<div class="temp-info"><p class="temperature">${temperature}°C</p><p class="minMax">${tempMax} / ${tempMin}</p></div><div class="weatherIcon"><img src="${weatherIcon}"></div><div class="sun-times"><h4>${weatherTitle}</h4><p>Sunrise: ${sunrise.toLocaleTimeString()}</p><p>Sunset: ${sunset.toLocaleTimeString()}</div>`
  );
};

// function to render time ajax call to the dashboard
app.displayTimeDashboard = function(time, localOffset) {
  const currentDate = new Date();
  const timezoneOffset = currentDate.getTimezoneOffset() / 60;
  const timeDiff = timezoneOffset + localOffset;
  const displayedTime = new Date(
    currentDate.setHours(currentDate.getHours() + timeDiff)
  );
  let offsetSign = ``;
  if (timeDiff > 0) {
    offsetSign = `+`;
  }

  let minutes = displayedTime.getMinutes();
  minutes = minutes > 9 ? minutes : "0" + minutes;

  $(`.dateTime`).html(
    `<div><h4>local date + time</h4><p class="date">${displayedTime.toDateString()}</p></div><div><p class="time">${displayedTime.getHours()}:${minutes}</p></div><div><p class="timezone">GMT ${offsetSign}${localOffset}</p><p>(${
      app.timezone
    })</p></div>`
  );
};

// function to render photo ajax call to the dashboard
app.displayPhotoDashboard = function(photo) {
  const photoURL = photo.hits[0].largeImageURL;

  $(`.cityPhoto`).css(`background-image`, `url(${photoURL}`);
};

// function to retrieve news, time and weather objects and render to dashboard
app.dashboardAPICalls = async function(
  officialCityName,
  countryName,
  latitude,
  longitude,
  localOffset
) {
  try {
    const news = await app.getNews(officialCityName, countryName);
    const time = await app.getTimezone(latitude, longitude);
    const weather = await app.getWeather(latitude, longitude);
    let photo = await app.getPhoto(officialCityName, countryName);
    if (photo.hits == 0) {
      photo = await app.getPhoto("town", countryName);
    }

    $(`.cityName`).html(
      `<h2>follow me to</h2><h3><span>${officialCityName},</span></h3> <h3><span>${countryName}</span></h3>`
    );

    app.displayNewsDashboard(news);
    app.displayWeatherDashboard(weather, localOffset);
    app.displayTimeDashboard(time, localOffset);
    app.displayPhotoDashboard(photo);
    $(`.dashboard`).removeClass(`dashboardOff`);
    app.smoothScroll();
    app.clearInput();
  } catch (error) {
    alert(
      "⚠️ failed to retrieve news / timezone / weather / photograph info 🔥"
    );
  }
};

app.clearInput = function() {
  setTimeout(function() {
    app.userInput = $(`:text`).val(``);
    $(".cityList").removeClass("fadeBlack");
    $(".cityList")
      .removeClass("zoomIn")
      .removeClass("opacityChange");
  }, 1000);
};

// INIT FUNCTION
app.init = function() {
  app.checkUserInput();
  app.clearHash();
  // app.smoothScroll();
};

// DOCUMENT READY
$(function() {
  app.init();
});
