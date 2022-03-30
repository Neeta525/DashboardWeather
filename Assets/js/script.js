var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#searchCity");

var currentCityEl = document.querySelector("#currentCity-containter");
var historyContainerEl = document.querySelector("#history-container");
var forecastContainerEl = document.querySelector("#forecast-container");
var forecast5 = document.querySelector("#forecast5")

var APIKey = "c7d3d48601b1c7967b9b776ae498a355";

var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchCity = cityInputEl.value.trim();

    if (searchCity) {
        getCityWeather (searchCity);

        forecastContainerEl.texContent = "";
        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
};


var getCityWeather = function (city) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function (data){
            console.log(data);
            displayCity(data, city);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function (error) {
        alert("unable to retreive city");
    });
};

// var getCityData = function (Language) {
//     var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + Language;

//     fetch(apiUrl).then(function (response) {
//         if (response.ok) {
//             response.json().then(function(data) {
//                 displayCity(data.items, Language);
//             });
//         } else {
//             alert("Error: " + response.statusText);
//         }
//     });
// };

var displayCity = function (cities, searchTerm) {
    if (cities.length === 0) {
        forecastContainerEl.texContent = "No city was found.";
        return;
    }
    forecast5.textContent = searchTerm;

    for (var i =0; i < cities.length; i++) {
        var cityName = cities[i].temperature;

        var cityEl = document.createElement("a");
        cityEl.classList = "card col-md-8";
        cityEl.setAttribute("href");

        var titleEl = document.createElement("span");
        titleEl.textContent = cityName;

        cityEl.appendChild(titleEl);

        var statusEl = document.createElement("span");
        statusEl.classList ="col-md-4 offset-md-4";

        cityEl.appendChild(statusEl);

        forecastContainerEl.appendChild(cityEl);
    }
}

searchFormEl.addEventListener('submit', formSubmitHandler);
