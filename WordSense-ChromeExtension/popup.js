document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggle-btn');
  const fieldButtons = document.querySelectorAll('.field-btn');
  

  // Get the current state from storage
  chrome.storage.sync.get(['isExtensionEnabled', 'selectedField'], function (data) {
    const isExtensionEnabled = data.isExtensionEnabled ?? true;
    const selectedField = data.selectedField ?? 'General';

    updateButtonState(isExtensionEnabled);
    setActiveField(selectedField);
  });

  // Toggle extension state
  toggleButton.addEventListener('click', function () {
    chrome.storage.sync.get('isExtensionEnabled', function (data) {
      const isEnabled = data.isExtensionEnabled ?? true;
      const newState = !isEnabled;

      chrome.storage.sync.set({ isExtensionEnabled: newState }, function () {
        updateButtonState(newState);
        chrome.runtime.sendMessage({ action: 'toggleExtension', isEnabled: newState });
      });
    });
  });

  // Handle field button clicks
  fieldButtons.forEach(button => {
    button.addEventListener('click', function () {
      const selectedField = this.getAttribute('data-field');

      // Save the selected field to storage
      chrome.storage.sync.set({ selectedField }, function () {
        setActiveField(selectedField);
      });
    });
  });

  // Update the toggle button state
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

  // Set the active field button
  function setActiveField(field) {
    fieldButtons.forEach(button => {
      button.classList.remove('active');
      if (button.getAttribute('data-field') === field) {
        button.classList.add('active');
      }
    });
  }
});

document.getElementById('save-custom-field').addEventListener('click', function () {
  const customField = document.getElementById('custom-field-input').value.trim();

  if (customField) {
    chrome.storage.sync.set({ selectedField: customField }, function () {
      alert("Custom field saved!");
      setActiveField(customField);
    });
  }
});
