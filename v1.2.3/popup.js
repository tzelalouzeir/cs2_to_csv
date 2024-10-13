document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle');

  // Initialize the toggle button state
  chrome.storage.local.get(['extensionActive'], function(result) {
    const isActive = result.extensionActive;
    toggleButton.textContent = isActive ? 'Deactivate' : 'Activate';
    toggleButton.className = isActive ? 'deactivate' : 'activate';
  });

  function sendMessageToContentScript(action, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ['content.js']
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            chrome.tabs.sendMessage(tabs[0].id, { action }, callback);
          }
        }
      );
    });
  }

  document.getElementById('download').addEventListener('click', () => {
    sendMessageToContentScript('downloadCSV');
  });

  document.getElementById('reset').addEventListener('click', () => {
    sendMessageToContentScript('resetItems');
  });

  // Toggle extension state
  toggleButton.addEventListener('click', () => {
    chrome.storage.local.get(['extensionActive'], function(result) {
      const newStatus = !result.extensionActive;
      chrome.storage.local.set({ extensionActive: newStatus }, function() {
        toggleButton.textContent = newStatus ? 'Deactivate' : 'Activate';
        toggleButton.className = newStatus ? 'deactivate' : 'activate';
        // Reload the current tab to apply changes
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.reload(tabs[0].id);
        });
      });
    });
  });

  // Close the popup when clicking outside
  document.addEventListener('click', (event) => {
    if (!document.body.contains(event.target)) {
      chrome.runtime.sendMessage({ action: 'closePopup' });
    }
  });
});
