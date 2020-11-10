
const runScript = () => {
   "use strict";

   // Weather API info
   const weatherAPI = {
      apiKey: "991b53c438c4367255ef8979c7741abd",
      baseUrl: `http://api.openweathermap.org/data/2.5/weather`,
   }


   //Global variables
   const formSearch = document.querySelector(".weather-app__search-input"),
      searchInput = document.querySelector(".weather-app__city-search"),
      searchBtn = document.querySelector(".weather-app__search-input-btn"),
      weatherDetailsBody = document.querySelector(".weather-app__bottom"),
      cityName = document.querySelector(".heading-2");
      /*temperature = document.querySelector("."),
      weatherCondition = document.querySelector("."),
      temperatureMax = document.querySelector("."),
      temperatureMin = document.querySelector("."),
      weatherIcon = document.querySelector("."),
      TemperatureFeeling = document.querySelector(".temp-feeling"),
      humidity = document.querySelector(".humidity"),*/


   // add zero to munites and seconds when needed
   const addZero = (num) => {
      return (parseInt(num, 10) < 10 ? "0" : "") + num;
   };

   // display curent date as a string on the screen
   const displayCurrentDate = () => {
      const date = document.querySelector(".weather-app__date");
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

      const time = document.querySelector(".weather-app__time");
      const showAmPm = true;

      const amPm = hour >= 12 ? "PM" : "AM"; // figure out either PM or AM

      hour = hour % 12 || hour; //get a 12 hour format

      time.innerHTML = `${hour}<span>:</span>${addZero(minute)}<span>:</span>${addZero(second)}${showAmPm ? amPm : ""}` // update UI

      setTimeout(displayCurrentTime, 1000);
   };

   // change background image based on current time 
   const changeBgImage = () => {
      const today = new Date(),
         hour = today.getHours(),
         wrapper = document.querySelector(".wrapper");

      if (hour < 12) {
         wrapper.style.backgroundImage = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(../images/bg-covers/sunrise.jpg)';
      } else if (hour < 18) {
         wrapper.style.backgroundImage = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(../images/bg-covers/sunset.jpg)';
      } else {
         wrapper.style.backgroundImage = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(../images/bg-covers/night.jpg)';
      }
   };

   // helper function that holds  fetch request, error handling and conversion to JSON format
   const getJSONData = (url, errorMessage = "Something went wrong with your request") => {
      return fetch(url)
         .then(response => {
            if (!response.ok) {
               throw new Error(`${errorMessage} ${response.status}`)
            }
            return response.json();
         })
   };

   // request a certain city from a weather api
   const requestCity = (city) => {
      getJSONData(`${weatherAPI.baseUrl}?q=${city}&appid=${weatherAPI.apiKey}`, 'City Not Found')
         .then(data => {
            console.log(data);
            renderWeatherData(data);
         })
         .catch(error => {
            console.log(`${error.message}`);
         });
   };


   //event listeners
   formSearch.addEventListener("submit", (event) => {
      event.preventDefault();

      const searchedCity = searchInput.value.toLowerCase().trim();
      formSearch.reset();

      requestCity(searchedCity)

      /*if (event.code === "Enter") {
         event.preventDefault();
         const searchInput = formSearch.children[0].children[0]; // grab search input
         const inputValue = searchInput.value;
         
         if (inputValue) {
            console.log("there is a value");
         } else {
            console.log("Nope..no value at all");
         }
      } */

   });

   searchBtn.addEventListener("click", () => {

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