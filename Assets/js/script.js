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
var forecastList = document.querySelector("#forecastList");
// var day1 = document.querySelector("#card1");
// var day2 = document.querySelector("#card2");
// var day3 = document.querySelector("#card3");
// var day4 = document.querySelector("#card4");
// var day5 = document.querySelector("#card5");
var today = moment().format("MMMM Do, YYYY");

//API key from open weather map
var APIKey = "c7d3d48601b1c7967b9b776ae498a355";

//form validator
var formSubmitHandler = function (event) {
    event.preventDefault();

    var searchCity = cityInputEl.value.trim();

    if (searchCity) {
        getCoords (searchCity);
        currentEl.textContent = searchCity + " " + today;
    }
};
//Local Storage-**not working right now
// var citiesList = [];
// //function for history-local storage

// function renderLastCity() {
//     cityList.innerHTML = "";
//     historyContainerSpan.textContent = citiesList.length;

//     for (var i = 0; i < citiesList.length; i++) {
//         var list = citiesList[i];

//         var li = document.createElement("li");
//         li.textContent = list;
//         li.setAttribute("data-index", i);

//         var button = document.createElement("button");
//         button.textContent = ("searchCity");

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
var getCityWeather = function (lat, lon) {
    // var cityInfo = cityInputEl.value;
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?";
    var getlat = "lat=" + lat;
    var getlon = "&lon=" + lon;
    var rest = "&exclude=minutely,hourly,daily,alert&units=imperial&appid=";

    fetch(apiUrl + getlat + getlon + rest + APIKey)
    .then(function(response) {
        if (response.ok) {

            response.json().then(function (data){
            console.log(data);
            displayCity(data);
            displayInfo(data);
            
            // getDetails();
            // getUV();
            });
        }
    })
    .catch(function (error) {
        alert("unable to retreive city");
    });
};



//function for 5-day forecast
function forecastDisplay(data) {
    for (var i = 0; i < 5; i++) {
        var container = document.createElement("div");
        var date = moment().format('L'); 
        container.classList.add("bg-dark");
        container.classList.add("text-white");
        container.classList.add("card");
        var li = document.createElement("li");
        var cardTitle = document.createElement("h5");
        cardTitle.textContent = date;
        var templi = document.createElement("li");
        templi.textContent = "Temp: " + data.list[i].main.temp + "\u00B0" + "F";
        var windli = document.createElement("li");
        windli.textContent = "Wind: " + data.list[i].wind.speed + " MPH";
        var humidityli = document.createElement("li");
        humidityli.textContent = "UV Index: " + data.list[i].main.humidity + "%";

        li.appendChild(cardTitle)
        container.appendChild(li)
        container.appendChild(templi)
        container.appendChild(windli)
        container.appendChild(humidityli)
        forecastList.appendChild(container)
    }
}



//Function for longitude and latitude 
function forecast(lat, long) {
    var getForecast = "https://api.openweathermap.org/data/2.5/forecast?";
    var getlat = "lat=" + lat;
    var getlong = "&lon=" + long;
    var rest = "&cnt=5&appid=";
    
    fetch(getForecast + getlat + getlong + rest + APIKey)
    .then(function(response){
        if (response.ok) {

            response.json().then(function (data){
            console.log(data);
            forecastDisplay(data);
            });
        }
    })
}

//This function 
function getCoords() {
    var getCoord = "http://api.openweathermap.org/geo/1.0/direct?q=";
    var cityName = cityInputEl.value;
    var rest = "&limit=1&appid=";

    fetch(getCoord + cityName + rest + APIKey)
    .then(function(response){
        if (response.ok) {
            response.json().then(function (data){
            console.log(data);
            getCityWeather(data[0].lat,data[0].lon);
            forecast(data[0].lat,data[0].lon);
            });
        }
    })
}


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


function displayInfo(data) {
    
    currentTempEl.textContent = "Temp: " + data.current.temp + "\u00B0" + "F";
    currentWindEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
    currentHumidityEl.textContent = "Humidity: " + data.current.humidity + "%";
    currentIndexEl.textContent = "UV Index: " + data.current.uvi;
}



searchFormEl.addEventListener('click', formSubmitHandler);
