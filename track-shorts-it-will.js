let shortsTime = 0;
const LIMIT = 60; // 60 seconds allowed

setInterval(async () => {
  // Get the current active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab && tab.url && tab.url.includes("://youtube.com")) {
    shortsTime++;
    console.log(`Shorts time: ${shortsTime}s`);

    if (shortsTime >= LIMIT) {
      // Lock them out by redirecting the tab to your plank timer page
      chrome.tabs.update(tab.id, { url: chrome.runtime.getURL("plank-punishercise.html") });
    }
  }
}, 1000);

// Listen for a message from popup.html that the plank is finished
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "resetTimer") {
    shortsTime = 0; // Reset their watch time!
    sendResponse({ status: "unlocked" });
  }
});
