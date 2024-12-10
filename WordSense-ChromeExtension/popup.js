// ./WordSense-ChromeExtension/popup.js
document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggle-btn');
  const fieldRadios = document.querySelectorAll('input[name="field"]');

  // Get the current state from storage
  chrome.storage.sync.get(['isExtensionEnabled', 'selectedField'], function (data) {
    const isExtensionEnabled = data.isExtensionEnabled ?? true; // Default to true if not set
    const selectedField = data.selectedField ?? 'General'; // Default field to General

    updateButtonState(isExtensionEnabled);
    setFieldSelection(selectedField);
  });

  // Listen for button clicks to toggle the extension state
  toggleButton.addEventListener('click', function () {
    chrome.storage.sync.get('isExtensionEnabled', function (data) {
      const isExtensionEnabled = data.isExtensionEnabled ?? true;
      const newState = !isExtensionEnabled;

      chrome.storage.sync.set({ isExtensionEnabled: newState }, function () {
        updateButtonState(newState);
        chrome.runtime.sendMessage({ action: 'toggleExtension', isEnabled: newState });
      });
    });
  });

  // Listen for changes in field selection
  fieldRadios.forEach(radio => {
    radio.addEventListener('change', function () {
      chrome.storage.sync.set({ selectedField: this.value });
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

  // Set the selected field in the UI
  function setFieldSelection(selectedField) {
    fieldRadios.forEach(radio => {
      radio.checked = (radio.value === selectedField);
    });
  }
});
