//  we have used open weather API
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// HTML elements
const your_weather = document.querySelector('.your_weather');
const search_weather = document.querySelector('.search_weather');
const search_weather_city = document.querySelector('.search_weather_city');
const searched_city = document.querySelector('.searched_city');
const search_button = document.querySelector('.search_button');
const your_location = document.querySelector('.your_location');
const loading_animation = document.querySelector('.loading_animation');
const city_name = document.querySelector('.city_name');
const wind_speed_content = document.querySelector('.wind_speed_content');
const humidity_content = document.querySelector('.humidity_content');
const clouds_content = document.querySelector('.clouds_content');
const weather_type = document.querySelector('.weather_type');
const temperature = document.querySelector('.temperature');
const access_location = document.querySelector('.access_location');
const location_access = document.querySelector('.location_access');
const wrapper = document.querySelector('.wrapper');

// variables
let city = "";
let latitude = false;
let longitude = false;

// functions

// function that will start initially
function startApp() {
    access_location.classList.add('active');
    your_weather.style.backgroundColor = "rgba(219, 226, 239, 0.5)";
}
startApp();

// function to fetch the data
async function fetchData(city, latitude, longitude) {

    try {
        // data fetch via city name
        if (city != "") {
            let fetcheData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
            let data = await fetcheData.json();
            display_location(data);
        }
        // data fetch via coordinates
        else {
            let fetcheData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
            let data = await fetcheData.json();
            access_location.classList.remove('active');
            display_location(data);
        }
    }
    catch (error) {
        alert("unable to fetch data ", error);
    }
}

// function to display data
function display_location(data) {
    if (data.cod != "404") {
        your_location.classList.add('active');
        city_name.textContent = data.name;
        wind_speed_content.textContent = data.wind.speed + " m/s";
        humidity_content.textContent = data.main.humidity + " %";
        clouds_content.textContent = data.clouds.all + " %";
        weather_type.textContent = data.weather[0].description;
        let temperature_data = parseFloat(data.main.temp - 273.15).toFixed(2);
        temperature.textContent = temperature_data + " °C";
    }
    else {
        alert("invalid city name or coordinates");
    }
}

// function to get co-ordinates
function getLocation() {
    try {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser");
        }
    }
    catch (error) {
        alert("unable to fetch coordinates ", error);
    }
}

function showPosition(position) {
    fetchData("", parseFloat(position.coords.latitude), parseFloat(position.coords.longitude));
}


// event listners

location_access.addEventListener('click', () => {
    latitude = true;
    longitude = true;
    getLocation();
});

your_weather.addEventListener('click', () => {
    your_weather.style.backgroundColor = "rgba(219, 226, 239, 0.5)";
    search_weather.style.backgroundColor = "";
    if (latitude == true && longitude == true) {
        access_location.classList.remove('active');
        your_location.classList.remove('active');
        search_weather_city.classList.remove('active');
        getLocation()
    }
    else {
        access_location.classList.add('active');
        your_location.classList.remove('active');
        search_weather_city.classList.remove('active');
    }
})

search_weather.addEventListener('click', () => {
    your_weather.style.backgroundColor = "";
    search_weather.style.backgroundColor = "rgba(219, 226, 239, 0.5)";
    access_location.classList.remove('active');
    your_location.classList.remove('active');
    search_weather_city.classList.add('active');
    searched_city.value = "";
});

search_button.addEventListener('click', () => {
    let city = searched_city.value.toLowerCase();
    fetchData(city, 0, 0);
});

searched_city.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        let city = searched_city.value.toLowerCase();
        fetchData(city, 0, 0);
    }

});


loading_animation.classList.add('active');
