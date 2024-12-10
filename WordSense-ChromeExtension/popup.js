document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggle-btn');
    
    // Get the current state from storage
    chrome.storage.sync.get('isExtensionEnabled', function (data) {
      const isExtensionEnabled = data.isExtensionEnabled ?? true; // Default to true if not set
  
      // Set the button state based on the stored value
      updateButtonState(isExtensionEnabled);
    });
    
    // Listen for button clicks to toggle the extension state
    toggleButton.addEventListener('click', function () {
      chrome.storage.sync.get('isExtensionEnabled', function (data) {
        const isExtensionEnabled = data.isExtensionEnabled ?? true;
  
        // Toggle the state
        const newState = !isExtensionEnabled;
  
        // Save the new state in chrome.storage
        chrome.storage.sync.set({ isExtensionEnabled: newState }, function () {
          updateButtonState(newState);
  
          // Optionally notify other parts of the extension (content script, etc.)
          chrome.runtime.sendMessage({ action: 'toggleExtension', isEnabled: newState });
        });
      });
    });
  
    // Update button text and class based on state
    function updateButtonState(isEnabled) {
      if (isEnabled) {
        toggleButton.textContent = "Turn Off";
        toggleButton.classList.remove("off");
        toggleButton.classList.add("on");
      } else {
        toggleButton.textContent = "Turn On";
        toggleButton.classList.remove("on");
        toggleButton.classList.add("off");
      }
    }
  });
  