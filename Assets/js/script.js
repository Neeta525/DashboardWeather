var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#searchCity");

var currentCityEl = document.querySelector("#currentCity-containter");
var currentTempEl = document.querySelector("#cTemp");
var currentWindEl = document.querySelector("#cWind");
var currentHumidtyEl = document.querySelector("#cHumidty");
var currentIndexEl = document.querySelector("#cIndex");

var historyContainerSpan = document.querySelector("#historyContainer");
var cityButton = document.querySelector("#cityButton");

var forecastContainerEl = document.querySelector("#forecast-container");
var forecast5 = document.querySelector("#forecast5")

//API key from open weather map
var APIKey = "c7d3d48601b1c7967b9b776ae498a355";

//form validator
var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchCity = cityInputEl.value.trim();

    if (searchCity) {
        getCityWeather (searchCity);

        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
};


//function for history-local storage
renderLastCity();

function renderLastCity() {
    var citySearch = localStorage.getItem("citySearch");

    if (!searchCity) {
        return;
    }
    historyContainerSpan.textContent = citySearch;
}

cityButton.addEventListener("click", function(event){
    event.preventDefault();

    var citySearch = document.querySelector("#searchCity").value;
        
        localStorage.setItem("citySearch", citySearch);
    }
);

//Get data from the URL
var getCityWeather = function (city) {
    var cityInfo = cityInputEl.value;
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function (data){
            console.log(data);
            displayCity(data, city);
            displayInfo(data);
            forecast(data.coord.lat, data.coord.lon)
            });
        }
    })
    .catch(function (error) {
        alert("unable to retreive city");
    });
};

//function for current date(s)
// function currentWeather(date) {
//     var today = moment().format("MMMM Do, YYYY");
// }

//Create function for weather detail to go to each card for 5-day forecast
function forecast(lat, long) {
    var getForecast = "https://api.openweathermap.org/data/2.5/forecast?";
    var getlat = "lat=" + lat;
    var getlong = "&lon=" + long;
    var rest = "&appid=";
    
    fetch(getForecast + getlat + getlong + rest + APIKey)
    .then(function(response){
        if (response.ok) {
            console.log(response);
            response.json().then(function (data){
            console.log(data);
            });
        }
    })

}
// forecast();

function getCoords() {
    var getCoord = "http://api.openweathermap.org/geo/1.0/direct?q=";
    var cityName = cityInputEl.value;
    var rest = "&limit=1&appid=";

    fetch(getCoord + cityName + rest + APIKey)
    .then(function(response){
        if (response.ok) {
            response.json().then(function (data){
            console.log(data);
            });
        }
    })
}

// getCoords();
//this function creates elements for current city displayed at top and appends them to the area they need to go on the web page
var displayCity = function (cities) {

for (var i = 0; i < cities.length; i++) {
    var cityCurrent = document.createElement("h4")
    var tempCurrent = document.createElement("p");
    var windCurrent = document.createElement("p");
    var humidityCurrent = document.createElement("p");
    var indexCurrent = document.createElement("p")
    cityCurrent.textContent = cities[i].city;
    tempCurrent.textContent = cities[i].temp;
    windCurrent.textContent = cities[i].wind;
    humidityCurrent.textContent = cities[i].humidity;
    indexCurrent.textContent = cities[i].uvindex;
    currentCityEl.append(cityCurrent);
    currentTempEl.append(tempCurrent);
    currentWindEl.append(windCurrent);
    currentHumidtyEl.append(humidityCurrent);
    currentIndexEl.append(indexCurrent);
}
}


function displayInfo(data) {
    currentTempEl.textContent = "Temp: " + data.main.temp;

}

searchFormEl.addEventListener('click', formSubmitHandler);
