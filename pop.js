document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['interval', 'breakDuration', 'isEnabled'], (data) => {
    document.getElementById('interval').value = data.interval || 60;
    document.getElementById('breakDuration').value = data.breakDuration || 10;
    document.getElementById('toggle').checked = data.isEnabled;
  });

  document.getElementById('saveButton').addEventListener('click', () => {
    const interval = Number(document.getElementById('interval').value);
    const breakDuration = Number(document.getElementById('breakDuration').value);
    const isEnabled = document.getElementById('toggle').checked;

    console.log(`Saving settings: Interval=${interval}, Break Duration=${breakDuration}, Enabled=${isEnabled}`);

    chrome.storage.sync.set({ interval, breakDuration, isEnabled }, () => {
      if (isEnabled) {
        chrome.alarms.clear('takeBreak', () => {
          console.log('Cleared previous alarm');
          chrome.alarms.create('takeBreak', { delayInMinutes: interval, periodInMinutes: interval });
          console.log('Created new alarm with interval', interval);
        });
      } else {
        chrome.alarms.clear('takeBreak');
        console.log('Break reminders disabled');
      }
      window.close(); // Close the popup after saving settings
    });
  });
});