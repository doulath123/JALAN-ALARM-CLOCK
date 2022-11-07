const alarmsound=new Audio("alarmsound.mp3");
const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setDay=document.querySelector("#days");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");

window.addEventListener("DOMContentLoaded", (event) => {
  
  dropDownMenu(1, 12, setHours);
 
  dropDownMenu(0, 59, setMinutes);

  dropDownMenu(0, 59, setSeconds);

  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var current_day=days[new Date().getDay()]

setAlarmButton.addEventListener("click", getInput);


function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}


function getCurrentTime() {
  let time = new Date();
  time=time.toLocaleTimeString('en-US')
 
  currentTime.innerHTML = `${time} ${current_day}`;
  

  return `${time} ${current_day}`;
}


function getInput(e) {
  e.preventDefault();
  const hourValue = setHours.value;
  const minuteValue = setMinutes.value;
  const secondValue = setSeconds.value;
  const amPmValue = setAmPm.value;
  const dayValue= setDay.value;

  const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    amPmValue,
    dayValue
  );
  setAlarm(alarmTime);
}

function convertToTime(hour, minute, second, amPm, day) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm} ${day}`;
}


function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
   
    
    if (time === getCurrentTime()) {
      
      
      alarmsound.play();
      alert("Alarm Ringing")
      alarmsound.pause();
    }
    
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm" data-id=${intervalId}>Delete❎</button>

              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmContainer.prepend(alarm);
}

function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}
function saveAlarm(time) {
  const alarms = checkAlarams();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}


function fetchAlarm() {
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}


function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  deleteAlarmFromLocal(time);
  alarm.remove();
}

function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}