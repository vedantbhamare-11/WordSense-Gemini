// ./WordSense-ChromeExtension/background.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'toggleExtension') {
      const isEnabled = message.isEnabled;
  
      // Enable/Disable functionality based on isEnabled
      if (isEnabled) {
        // Activate your functionality (tooltips, meaning fetching, etc.)
        console.log("Extension enabled");
      } else {
        // Disable functionality
        console.log("Extension disabled");
      }
  
      // Send response back if needed
      sendResponse({ success: true });
    }
  });
  