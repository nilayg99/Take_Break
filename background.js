chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'takeBreak') {
    console.log('Alarm triggered: takeBreak');
    chrome.storage.sync.get(['breakDuration', 'isEnabled'], (data) => {
      if (data.isEnabled) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            console.log(`Running break on tab ${tabs[0].id}`);
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: () => {
                let overlay = document.createElement('div');
                overlay.id = 'break-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = 0;
                overlay.style.left = 0;
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'white';
                overlay.style.zIndex = 9999;
                overlay.style.display = 'flex';
                overlay.style.justifyContent = 'center';
                overlay.style.alignItems = 'center';

                let gif = document.createElement('div');
                gif.innerHTML = '<div class="tenor-gif-embed" data-postid="18253672" data-share-method="host" data-aspect-ratio="0.634375" data-width="100%"><a href="https://tenor.com/view/cool-doge-cool-dog-dog-dance-dance-dog-dance-doge-gif-18253672">Cool Doge Dog Dance Sticker</a> from <a href="https://tenor.com/search/cool+doge-stickers">Cool Doge Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>';

                overlay.appendChild(gif);
                document.body.appendChild(overlay);

                setTimeout(() => {
                  overlay.remove();
                }, data.breakDuration * 1000); // breakDuration is in seconds
              }
            });
          }
        });
      }
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['interval', 'breakDuration', 'isEnabled'], (data) => {
    if (data.isEnabled !== false) {
      const interval = data.interval || 60;
      chrome.alarms.create('takeBreak', { delayInMinutes: interval, periodInMinutes: interval });
      console.log(`Started breaks with interval: ${interval} minutes and break duration: ${data.breakDuration || 10} seconds`);
    }
  });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.isEnabled) {
      if (changes.isEnabled.newValue) {
        chrome.storage.sync.get(['interval', 'breakDuration'], (data) => {
          const interval = data.interval || 60;
          chrome.alarms.create('takeBreak', { delayInMinutes: interval, periodInMinutes: interval });
          console.log(`Started breaks with interval: ${interval} minutes and break duration: ${data.breakDuration || 10} seconds`);
        });
      } else {
        chrome.alarms.clear('takeBreak');
        console.log('Break reminders disabled');
      }
    }
  }
});