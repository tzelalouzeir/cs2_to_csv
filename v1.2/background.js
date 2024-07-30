chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'closePopup') {
    chrome.tabs.create({ url: 'about:blank' });
  }
});
