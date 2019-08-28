app = {}

// function to render list of possible city name matches based on user input defined here
app.cityMenu = function () {
    $(`form`).on(`submit`, function(e){
        e.preventDefault();
        const cityName = ($(`:text`).val());

        



        });
    }


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

app.init = function () {
    app.cityMenu();
};

$(function() {
app.init()


});