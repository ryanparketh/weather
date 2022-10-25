// create const
const submitBtnEl = document.getElementById('search');
const inputCityEl = document.getElementById('input-city');
const fiveDayEl = document.getElementById('five-day');
const apiKey = 'cef56e7929d1f22c4aa06d4b3d2474b1';
let cityHeaderEl = document.getElementById('city-search');
var lat, lon;
var searchHistory = [];
const searchHistoryDiv = document.getElementById('search-history');

// added event listener when clicking search button
submitBtnEl.addEventListener('submit', weatherSearchHandler);

function weatherSearchHandler(event) {
    event.preventDefault();
    var city = inputCityEl.value.trim();
    console.log('city= ', city);
    fetchGeoCoordinates(city);
}
function displaySearchHistory(){
    searchHistoryDiv.innerHTML = '';
    for(let i = searchHistory.length - 1; i >= 0; i--){
        let btnEl = document.createElement('button');
        btnEl.setAttribute('type', 'button');
        btnEl.setAttribute('data-search', searchHistory[i]);
        btnEl.classList.add('history-btn', 'btn-history');
        btnEl.textContent = searchHistory[i];
        searchHistoryDiv.append(btnEl);
    }
}

function addToHistory(city) {
    // tbd
    if(searchHistory.indexOf(city) !== -1){
        return;
    }
    searchHistory.push(city);
    localStorage.setItem('search-cities', JSON.stringify(searchHistory));
    displaySearchHistory();
}

// displaying the data
function displayWeather(city, jsonData) {
    
    dateEl = document.getElementById('date');
    dateEl.innerText = jsonData.list[0].dt_txt.slice(0,10);
    var tempEl = document.getElementById('current-temp');
    tempEl.innerHTML = `Current Tempature:  ${jsonData.list[0].main.temp}   &#176C`;
    var humidityEl = document.getElementById('humidity');
    humidityEl.innerText = `Humidity: ${jsonData.list[0].main.humidity}   %`;
    var windEl = document.getElementById('wind');
    windEl.innerText = `Wind Speed: ${jsonData.list[0].wind.speed}  KMPH`;
    var iconEl = document.getElementById('current-icon');
    const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        jsonData.list[0].weather[0]["icon"]
      }.svg`;
    iconEl.setAttribute('src', icon);
      let day = 'day1'
      let j = 1;
    // setting up to display future forcast

    for(let i = 7; i < jsonData.list.length; i += 8){
        day = 'day' + (j).toString();
        console.log ('day = ', day);
        j++;
     let dayDateEl = document.getElementById(day + '-date');
      dayDateEl.innerText = jsonData.list[i].dt_txt.slice(0,10);
    var dayTempEl = document.getElementById(day + '-temp');
    dayTempEl.innerHTML = `Current Tempature:  ${jsonData.list[i].main.temp}   &#176C`;
    var dayHumidityEl = document.getElementById(day + '-humidity');
    dayHumidityEl.innerText = `Humidity: ${jsonData.list[i].main.humidity}   %`;
    var dayWindEl = document.getElementById(day + '-wind');
    dayWindEl.innerText = `Wind Speed: ${jsonData.list[i].wind.speed}  KMPH`;
    var iconEl = document.getElementById(day + '-icon');
    const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        jsonData.list[i].weather[0]["icon"]
      }.svg`;
    iconEl.setAttribute('src', icon);
    }
      


   
}

// fetching the weather in the city
function fetchWeather(city, lat, lon) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
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
function init(){
    let savedHistory = localStorage.getItem('search-cities');
    if(savedHistory){
        searchHistory = JSON.parse(savedHistory);
    }
    displaySearchHistory();
}
init();
function handleSearchHistory(e){
    if(!e.target.matches('.btn-history')){
        return;
    }
    let btnEl = e.target;
    let city = btnEl.getAttribute('data-search');
    fetchGeoCoordinates(city);
}
searchHistoryDiv.addEventListener('click', handleSearchHistory)