var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#searchCity");

var currentCityEl = document.querySelector("#currentCity-containter");
var currentEl = document.querySelector("#cCity");
var currentTempEl = document.querySelector("#cTemp");
var currentWindEl = document.querySelector("#cWind");
var currentHumidityEl = document.querySelector("#cHumidity");
var currentIndexEl = document.querySelector("#cIndex");

var historyContainerSpan = document.querySelector("#historyContainer");
var cityList = document.querySelector("#cityList");
var cityButton = document.querySelector("#cityButton");

var forecastContainerEl = document.querySelector("#forecast-container");
var forecast5 = document.querySelector("#forecast5");
var day1 = document.querySelector("#card1");
var day2 = document.querySelector("#card2");
var day3 = document.querySelector("#card3");
var day4 = document.querySelector("#card4");
var day5 = document.querySelector("#card5");



//API key from open weather map
var APIKey = "c7d3d48601b1c7967b9b776ae498a355";

//form validator
var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchCity = cityInputEl.value.trim();

    if (searchCity) {
        getCityWeather (searchCity);
    }
};
//Local Storage-**not working right now
// var citiesList = [];
// //function for history-local storage

// function renderLastCity() {
//     cityList.innerHTML = "";
//     historyContainerSpan.texContent = citiesList.length;

//     for (var i = 0; i < citiesList.length; i++) {
//         var list = citiesList[i];

//         var li = document.createElement("li");
//         li.textContent = list;
//         li.setAttribute("data-index", i);

//         var button = document.createElement("button");
//         button.textContent = ("");

//         li.appendChild(button);
//         citiesList.appendChild(li);
//     }
// }

// function init() {
//     var storedCities = JSON.parse(localStorage.getItem("citiesList"));
//     if (storedCities !== null) {
//         citiesList = storedCities;
//     }
//     renderLastCity();
// }

// function storeCities() {
//     localStorage.setItem("citiesList", JSON.stringify(citiesList));
// }
// searchFormEl.addEventListener("submit", function(event) {
//     event.preventDefault();
//     var listText = cityInputEl.value.trim();

//     if (listText === "") {
//         return;
//     }
//     citiesList.push(listText);
//     cityInputEl.value = "";

//     storeCities();
//     renderLastCity();
// });

// citiesList.addEventListener("click", function(event) {
//     var element = event.target;

//     if (element.matches("button") === true) {
//         var index = element.parentElement.getAttribute("data-index");
//         citiesList.splice(index, 1);

//         storeCities();
//         renderLastCity();
//     }
// })

// init();

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
            forecast(data.coord.lat, data.coord.lon);
            getDetails(data);
            getUV(data);
            });
        }
    })
    .catch(function (error) {
        alert("unable to retreive city");
    });
};


//Function for weather detail to go to each card for 5-day forecast
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

function getDetails() {
    var getDetails = "https://api.openweathermap.org/data/2.5/weather?";
    var rest = "&appid=";

    fetch(getDetails + rest + APIKey)
    .then(function(response){
        if (response.ok) {
            response.json().then(function (data){
            console.log(data);
            });
        }
    })
}

function getUV() {
    var getUV = "https://api.openweathermap.org/data/2.5/onecall?=";
    var rest = "&appid=";

    fetch(getUV + rest + APIKey)
    .then(function(response){
        if (response.ok) {
            response.json().then(function (data){
            console.log(data);
            });
        }
    })
}
//getCoords(data);

//this function creates elements for current city displayed at top and appends them to the area they need to go on the web page
var displayCity = function (cities) {

for (var i = 0; i < cities.length; i++) {
    var current = document.createElement("h4")
    var tempCurrent = document.createElement("p");
    var windCurrent = document.createElement("p");
    var humidityCurrent = document.createElement("p");
    var indexCurrent = document.createElement("p")
    current.textContent = cities[i].city;
    tempCurrent.textContent = cities[i].temp;
    windCurrent.textContent = cities[i].wind;
    humidityCurrent.textContent = cities[i].humidity;
    indexCurrent.textContent = cities[i].uvindex;
    currentEl.append(current);
    currentTempEl.append(tempCurrent);
    currentWindEl.append(windCurrent);
    currentHumidityEl.append(humidityCurrent);
    currentIndexEl.append(indexCurrent);
}
}

var today = moment().format("MMMM Do, YYYY");


function displayInfo(data) {
    currentEl.textContent = data.cityName + " " + today;
    currentTempEl.textContent = "Temp: " + data.main.temp + "\u00B0" + "F";
    currentWindEl.textContent = "Wind: " + data.wind.speed + " MPH";
    currentHumidityEl.textContent = "Humidity: " + data.main.humidity + "%";
    // currentIndexEl.textContent = "UV Index: " + data.current.uvi;
}



searchFormEl.addEventListener('click', formSubmitHandler);
