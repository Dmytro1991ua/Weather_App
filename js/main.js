
const runScript = () => {
   "use strict";

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
         wrapper.style.backgroundImage = 'url(../images/bg-covers/sunrise.jpg)';
      } else if (hour < 18) {
         wrapper.style.backgroundImage = 'url(../images/bg-covers/sunset.jpg)';
      } else {
         wrapper.style.backgroundImage = 'url(../images/bg-covers/night.jpg)';
      }
   };

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