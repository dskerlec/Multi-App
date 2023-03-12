"use strict";
let weatherBtn = document.getElementById("weatherContentButton");
let weatherDailyBtn = document.getElementById("weatherDailyContentButton");
let weatherHourlyBtn = document.getElementById("weatherHourlyContentButton");
let pomodoroBtn = document.getElementById("pomodoroContentButton");
let pomodoroFocusBtn = document.getElementById("pomodoroFocusButton");
let pomodoroBreakBtn = document.getElementById("pomodoroBreakButton");
let pomodoroStartBtn = document.getElementById("pomodoroStartButton");
let startTime, interval = 0; //move
let timerValueMin = document.getElementById("minutes"); //move
let timerValueSec = document.getElementById("seconds");
let waterTrackerBtn =document.getElementById("waterTrackerContentButton");

weatherBtn.addEventListener("click", () => {
    openTabContent("weatherContent");
});
weatherDailyBtn.addEventListener("click", () => {
    openSubTabContent("dailyWeatherContent");
});
weatherHourlyBtn.addEventListener("click", () => {
    openSubTabContent("hourlyWeatherContent");
});

pomodoroBtn.addEventListener("click", () => {
    openTabContent("pomodoroContent");
});
pomodoroFocusBtn.addEventListener("click", () => {
    changePomodoroTimer(45);
});
pomodoroBreakBtn.addEventListener("click", () => {
    changePomodoroTimer(15);
});
pomodoroStartBtn.addEventListener("click", () => {
    startTime = timerValueMin.textContent;
    startPomodoroTimer(startTime, timerValueMin, timerValueSec);
})


waterTrackerBtn.addEventListener("click", () => {
    openTabContent("waterTrackerContent");
});

function openTabContent(tabName) {
    let tabContents = document.getElementsByClassName('tabContent');
    for (let i = 0; i < tabContents.length; i++)
    {
        tabContents[i].style.display = 'none';
    }
    let activeTab = document.getElementById(tabName);
    activeTab.style.display = 'block';
    let subTabContents = document.getElementsByClassName('subTabContent');
    for (let i = 0; i < subTabContents.length; i++)
    {
        subTabContents[i].style.display = 'none';
    }
}

function openSubTabContent(subTabName) {
    let tabContents = document.getElementsByClassName('subTabContent');
    for (let i = 0; i < tabContents.length; i++)
    {
        tabContents[i].style.display = 'none';
    }
        let activeTab = document.getElementById(subTabName);
        activeTab.style.display = 'block';
}
//move V
function changePomodoroTimer(time) {
    if (interval != 0){
        if (confirm("Are you sure you want to reset your timer?"))
        {
            clearInterval(interval)
            interval = 0;
            timerValueMin.textContent=time;
            timerValueSec.textContent="00";
        }
    }
    else
    {
        timerValueMin.textContent=time;
        timerValueSec.textContent="00";
    }
}

function startPomodoroTimer(timeValue, contentMin, contentSec) {
    if (timeValue != 0 && !interval)
    {
        let currentTime = Date.now();
        let endTime = Date.now() + (timeValue*60000);
        let secondsLeft = (endTime - currentTime)/1000;
        interval = setInterval(function () {
            let min = parseInt(secondsLeft / 60, 10);
            min = min < 10 ? "0" + min : min;
            let sec = parseInt(secondsLeft % 60, 10);
            sec = sec < 10 ? "0" + sec : sec;
    
            contentMin.textContent = min;
            contentSec.textContent = sec;
    
            if (--secondsLeft < 0) {
                clearInterval(interval)
                interval = 0;
            }
    
        }, 10);
    }
}
