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

var citiesList = [];

// function for searched cities-local storage
function renderLastCity() {
    cityList.innerHTML = "";
    for (var i = 0; i < citiesList.length; i++) {
        console.log(citiesList[i]);
        var li = document.createElement("li");
        li.textContent = citiesList[i];
        li.setAttribute("data-index", i);

        var button = document.createElement("button");
        button.textContent = ("Search it Again");

        li.appendChild(button);
        // console.log(list)
        cityList.appendChild(li);
    }
   
}

function init() {
    var storedCities = JSON.parse(localStorage.getItem("citiesList"));
    if (storedCities !== null) {
        citiesList = storedCities;
    }
    renderLastCity();
}

function storeCities() {
    for (var i=0; i < citiesList.length;  i++) {
        console.log (citiesList[i]);
    }
    localStorage.setItem("citiesList", JSON.stringify(citiesList));
}
cityButton.addEventListener("click", function(event) {
    event.preventDefault();
    var listText = cityInputEl.value.trim();

    if (listText === "") {
        return;
    }
    getCoords (listText);
    currentEl.textContent = listText + " " + today;
    citiesList.push(listText);
    cityInputEl.value = "";

    storeCities();
    renderLastCity();
});

// Add click event to list of cities searched


init();


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
            });
        }
    })
    .catch(function (error) {
        alert("unable to retreive city");
    });
};



//function for 5-day forecast
function forecastDisplay(data) {
    forecastList.innerHTML = "";
    for (var i = 0; i < 5; i++) {
        var container = document.createElement("div");
        var date = "the day after";
        container.classList.add("card2");
        container.classList.add("card");
        container.classList.add("text-white");
        var div = document.createElement("div");
        div.classList.add("card-body");
        div.classList.add("bg-dark");
        var cardTitle = document.createElement("h5");
        cardTitle.textContent = date;
        var templi = document.createElement("li");
        templi.textContent = "Temp: " + data.list[i].main.temp + "\u00B0" + "F";
        var windli = document.createElement("li");
        windli.textContent = "Wind: " + data.list[i].wind.speed + " MPH";
        var humidityli = document.createElement("li");
        humidityli.textContent = "UV Index: " + data.list[i].main.humidity + "%";

        windli.appendChild(humidityli)
        templi.appendChild(windli)
        cardTitle.appendChild(templi)
        div.appendChild(cardTitle)
        
        container.appendChild(div)
        forecastList.appendChild(container)
    }
}


//Function for longitude and latitude 
function forecast(lat, long) {
    var getForecast = "https://api.openweathermap.org/data/2.5/forecast?";
    var getlat = "lat=" + lat;
    var getlong = "&lon=" + long;
    var rest = "&cnt=5&units=imperial&appid=";
    
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

//This function calls the city name and location
function getCoords(city) {
    var getCoord = "https://api.openweathermap.org/geo/1.0/direct?q=";
    var cityName = cityInputEl.value;
    var rest = "&limit=1&appid=";

    fetch(getCoord + city + rest + APIKey)
    .then(function(response){
        if (response.ok) {
            response.json().then(function (data){
            // console.log(data);
            console.log("completed");
            getCityWeather(data[0].lat,data[0].lon);
            forecast(data[0].lat,data[0].lon);
            });
        }
    })
}


//this function creates elements for current city displayed at top and appends them to the area they need to go on the web page
var displayCity = function (cities) {

for (var i = 0; i < cities.length; i++) {
    var current = document.createElement("h2")
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

    var uvRatings = document.createElement("span");
    

if (uvRatings <= 2) {
    $("#rating-color").css("color", "green");
} else if (uvRatings < 6 && uvRatings > 2) {
    $("#rating-color").css("color", "yellow");
} else if (uvRatings < 8 && uvRatings > 5) {
    $("rating-color").css("color", "orange");
} else {
    $("rating-color").css("color", "red");
}

// uvRatings.innerHTML = data.current.uvi;
currentIndexEl.append(uvRatings);
}



searchFormEl.addEventListener('click', formSubmitHandler);
