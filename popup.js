'use strict';


const enabledText = document.getElementById('enabledText');
const enabled = document.getElementById('enabled');
const form = document.getElementById('form');
const text = document.getElementById('text');
const textarea = document.getElementById('textarea');
const clearButton = document.getElementById('clearButton');
const interval = document.getElementById('interval');

const setEnabledText = (status) => {
    enabledText.innerText = status ? "ENABLED" : "DISABLED";
};
const setStatus = (status) => {
    setEnabledText(status);
    if (status) {
        const interval = getInterval()
        chrome.browserAction.setBadgeText({text: "" + interval});
        chrome.alarms.create({
            delayInMinutes: interval,
        });
    } else {
        chrome.browserAction.setBadgeText({text: "x"});
    }
}
const getStatus = () => {
    return JSON.parse(localStorage.isActivated);
}

const getInterval = () => {
    return JSON.parse(localStorage.interval);
}

const getEvents = () => {
    const events = JSON.parse(localStorage.events);
    events.sort((a,b) => a.date - b.date);
    return events;
}

const formatEvents = (events) => {
    let text = "";
    events.forEach(e => {
        text += (new Date(e.date)) .toString();
        text += " ";
        text += e.event;
        text += "\n";
    });
    return text;
}

const refreshTextarea = () => {
    const events = getEvents();
    textarea.value = formatEvents(events);

    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

const status = getStatus();
setStatus(status);
enabled.checked = status;
refreshTextarea();
interval.value = getInterval();

enabled.addEventListener('change', (e) => {
    localStorage.isActivated = status;
    setStatus(e.target.checked);
})

interval.addEventListener('change', () => {
    localStorage.interval = interval.value;
    setStatus(getStatus())
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const events = getEvents();
    events.push({
        "date": (new Date()).valueOf(),
        "event": text.value,
    });
    localStorage.events = JSON.stringify(events);

    text.value = "";
    refreshTextarea();
});

clearButton.addEventListener('click', () => {
    localStorage.events = JSON.stringify([]);
    refreshTextarea();
})
