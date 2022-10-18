// create const
const submitBtnEl = document.getElementById('search');
const inputCityEl = document.getElementById('input-city');
const fiveDayEl = document.getElementById('five-day');
const apiKey = 'cef56e7929d1f22c4aa06d4b3d2474b1';
var lat, lon;

// added event listener when clicking search button
submitBtnEl.addEventListener('submit', weatherSearchHandler);

function weatherSearchHandler(event) {
    event.preventDefault();
    var city = inputCityEl.value.trim();
    console.log('city= ', city);
    fetchGeoCoordinates(city);
}

function addToHistory(city) {
    // tbd
}

// displaying the date
function displayWeather(city, jsonData) {
    dateEl = document.getElementById('date');
    dateEl.innerText = jsonData.list[0].dt_txt;
}

// fetching the weather in the city
function fetchWeather(city, lat, lon) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    fetch(weatherUrl)
        .then(function (resp) {
            return resp.json();
        })
        .then(function (jsonData) {

            console.log('jsonData = ', jsonData);


            displayWeather(city, jsonData)
        })
}
// fetching city coordinates for lat and lon
function fetchGeoCoordinates(city) {
    var geoCodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    fetch(geoCodingUrl)
        .then(function (resp) {
            return resp.json();
        })
        .then(function (jsonData) {
            if (!jsonData[0]) {
                console.log('location not found');
            } else {
                console.log('jsonData = ', jsonData);
                lat = jsonData[0].lat;
                lon = jsonData[0].lon;

                addToHistory(city);
                fetchWeather(city, lat, lon);
            }
        })
}