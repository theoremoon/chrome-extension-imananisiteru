'use strict';

if (!localStorage.isInitialized) {
    localStorage.isActivated = true;
    localStorage.isInitialized = true;
    localStorage.interval = 1;
    localStorage.events = JSON.stringify([]);
    chrome.alarms.create({
        delayInMinutes: JSON.parse(localStorage.interval),
    });
}

chrome.alarms.onAlarm.addListener(() => {
    const isActivated = JSON.parse(localStorage.isActivated);
    if (!isActivated) {
        return;
    }
    chrome.notifications.create({
        title: "いまなにしてる",
        message: "行動のログをとる",
        type: "basic",
        iconUrl: "jikan_tobu.png",
        silent: true,
    });
    chrome.alarms.create({
        delayInMinutes: JSON.parse(localStorage.interval),
    });
});


chrome.notifications.onClicked.addListener(() => {
    chrome.tabs.create({
        "url": "popup.html",
    })
});
