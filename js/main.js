
"use strict";
const runScript = () => {

   // Weather API info
   const weatherAPI = {
      apiKey: "991b53c438c4367255ef8979c7741abd",
      baseUrl: `http://api.openweathermap.org/data/2.5/weather`,
   }

   //Global variables
   const wrapperContent = document.querySelector(".wrapper"),
      formSearch = document.querySelector(".weather-app__search-input"),
      searchInput = document.querySelector(".weather-app__city-search"),
      date = document.querySelector(".weather-app__date"),
      time = document.querySelector(".weather-app__time"),
      weatherDetails = document.querySelector(".weather-app__bottom"),
      weatherAppHeader = document.querySelector(".weather-app__header"),
      weatherAppImg = document.querySelector(".weather-app__img");

   // add zero to munites and seconds when needed
   const addZero = (num) => {
      return (parseInt(num, 10) < 10 ? "0" : "") + num;
   };

   // display curent date as a string on the screen
   const displayCurrentDate = () => {
      const currentDay = new Date();

      const options = {
         weekday: 'long',
         year: "numeric",
         month: 'short',
         day: 'numeric',
      };

      date.textContent = currentDay.toLocaleDateString('en-US', options);
   };

   // display curent time
   const displayCurrentTime = () => {
      let today = new Date(),
         hour = today.getHours(),
         minute = today.getMinutes(),
         second = today.getSeconds();

      const showAmPm = true;

      const amPm = hour >= 12 ? "PM" : "AM"; // figure out either PM or AM

      hour = hour % 12 || hour; //get a 12 hour format

      time.innerHTML = `${hour}<span>:</span>${addZero(minute)}<span>:</span>${addZero(second)}${showAmPm ? amPm : ""}` // update UI

      setTimeout(displayCurrentTime, 1000);
   };

   // change background image based on current time 
   const changeBgImage = () => {
      const today = new Date(),
         hour = today.getHours();

      if (hour < 12) {
         wrapperContent.style.backgroundImage = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(../images/bg-covers/sunrise.jpg)';
      } else if (hour < 18) {
         wrapperContent.style.backgroundImage = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(../images/bg-covers/sunset.jpg)';
      } else {
         wrapperContent.style.backgroundImage = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(../images/bg-covers/night.jpg)';
      }
   };

   // helper function that holds  fetch request, error handling and conversion to JSON format
   const getJSONData = (url, errorMessage = "Something went wrong with your request") => {
      return fetch(url)
         .then(response => {
            if (!response.ok) {
               throw new Error(`${errorMessage}:${response.status}`)
            }
            return response.json();
         })
   };

   // request a certain city from a weather api
   const requestCity = (city) => {
      getJSONData(`${weatherAPI.baseUrl}?q=${city}&appid=${weatherAPI.apiKey}`, 'City Not Found')
         .then(data => {
            renderWeatherData(data);
         })
         .catch(error => {
            renderError(`Something went wrong with your request: ${error.message}, Please Try Again!`);
         });
   };


   // convert default Kelvin units into Celsius
   const kelvinToCelsius = (kelvin) => {
      const celcius = Math.round(kelvin - 273.15);
      return celcius;
   }

   //check wether if it is currently day or night at the specific city and based on that, change an weather app image
   const isDayTime = (icon) => {
      if (icon.includes("d")) {
         return true;
      } else {
         return false;
      }
   }

   // render weather data from api and update UI
   const renderWeatherData = (city) => {
      const iconPath = city.weather[0].icon; // garb a path to a weather icon from API
      const weatherIconSrc = `http://openweathermap.org/img/wn/${iconPath}@2x.png`; // change a weather icon depends on a current weather state and either it is day or night  in particular city

      weatherDetails.innerHTML = `
         <div class="weather-app__bottom-body">
               <h2 class="heading-2">${city.name},<span class="heading-2--diff">${city.sys.country}</span></h2>
               <!--First row starts-->
               <div class="weather-app__row">
                    <span class="weather-app__temperature">${kelvinToCelsius(city.main.temp)}&deg;C</span>
                    <div class="weather-app__temperature-details">
                        <span class="weather-app__weather-condition">${city.weather[0].description}</span>
                        <span class="weather-app__temperature-max">${kelvinToCelsius(city.main.temp_max)}&deg;C</span>
                        <span class="weather-app__temperature-min">${kelvinToCelsius(city.main.temp_min)}&deg;C</span>
                    </div>
               </div>
               <!--First row ends-->
               <!--Second row starts-->
               <div class="weather-app__row">
                    <figure class="weather-app__icon-box">
                        <img src="${weatherIconSrc}" alt="weather icon" class="weather-app__icon">
                    </figure>
               </div>
               <!--Second row ends-->
               <!--Third row starts-->
               <div class="weather-app__row">
                    <div class="weather-app__temperature-additional">
                        <div class="weather-app__temperature-additional-box">
                           <span class="weather-app__temperature-feeling">${kelvinToCelsius(city.main.feels_like)}&deg;C</span>
                           <p class="weather-app__temperature-additional-title">Feels like</p>
                        </div>
                           <div class="weather-app__temperature-additional-box">
                           <span class="weather-app__temperature-feeling">${city.main.humidity}%</span>
                           <p class="weather-app__temperature-additional-title">Humidity</p>
                        </div>
                    </div>
               </div>
               <!--Third row ends-->
         </div> 
      `

      if (isDayTime(weatherIconSrc)) { // pass recieved from API icon (whether day or night) 
         weatherAppImg.setAttribute("src", "/images/app-img/day.jpg");
         weatherDetails.style.backgroundColor = 'var(--color-lighter-blue)';
         weatherDetails.style.color = 'var(--color-white)';
         weatherAppHeader.style.color = "var(--color-mantis-darker)";

      } else {
         weatherAppImg.setAttribute("src", "/images/app-img/night.jpg");
         weatherDetails.style.backgroundColor = 'var(--color-dark-blue)';
         weatherDetails.style.color = 'var(--color-mantis)';
         weatherAppHeader.style.color = 'var(--color-mantis-darker)';
      }

   };

   // render am Error message text and insert it to HTML
   const renderError = (message) => {
      if (message) {
         weatherDetails.innerHTML = ""; // clear wethear app body to display an error
         weatherDetails.insertAdjacentHTML("beforeend", message);
     }
   };


   //event listeners
   formSearch.addEventListener("submit", (event) => {
      event.preventDefault();

      const searchedCity = searchInput.value.toLowerCase().trim();
      formSearch.reset();
      weatherDetails.innerHTML = ""; // clear weather app details card before searching a new city;
      weatherDetails.classList.add("active");
      requestCity(searchedCity);
   });

   //call functions
   displayCurrentDate();
   displayCurrentTime();
   changeBgImage();
};

if (document.readyState === "loading") {
   document.addEventListener("DOMContentLoaded", runScript);
} else {
   runScript();
}