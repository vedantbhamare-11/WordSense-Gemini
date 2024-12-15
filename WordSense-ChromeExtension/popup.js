document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggle-btn');
  const fieldButtons = document.querySelectorAll('.field-btn');
  const customFieldInput = document.getElementById('custom-field-input');
  const saveCustomFieldButton = document.getElementById('save-custom-field');
  const customFieldButtonContainer = document.getElementById('custom-field-button-container');
  let customFieldButton = null;

  // Get the current state from storage
  chrome.storage.sync.get(['isExtensionEnabled', 'selectedField'], function (data) {
    const isExtensionEnabled = data.isExtensionEnabled ?? true;
    const selectedField = data.selectedField ?? 'General';

    updateButtonState(isExtensionEnabled);
    setActiveField(selectedField);

    if (selectedField && !isPredefinedField(selectedField)) {
      createCustomFieldButton(selectedField);
    }
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

      chrome.storage.sync.set({ selectedField }, function () {
        setActiveField(selectedField);
        if (customFieldButton) {
          customFieldButton.classList.remove('active');
        }
      });
    });
  });

  // Save custom field and create a button
  saveCustomFieldButton.addEventListener('click', function () {
    const customField = customFieldInput.value.trim();

    if (customField) {
      chrome.storage.sync.set({ selectedField: customField }, function () {
        setActiveField(customField);
        createCustomFieldButton(customField);
      });
    }
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
      button.style.backgroundColor = '#e0e0e0'; // Reset background color for predefined buttons
      button.style.color = '#333'; // Reset text color for predefined buttons
  
      if (button.getAttribute('data-field') === field) {
        button.classList.add('active');
        button.style.backgroundColor = '#01adb5'; // Active button background color
        button.style.color = '#fff'; // Active button text color
      }
    });
  
    if (customFieldButton) {
      if (customFieldButton.getAttribute('data-field') === field) {
        customFieldButton.classList.add('active');
        customFieldButton.style.backgroundColor = '#01adb5'; // Active button background color
        customFieldButton.style.color = '#fff'; // Active button text color
      } else {
        customFieldButton.classList.remove('active');
        customFieldButton.style.backgroundColor = '#e0e0e0'; // Inactive button background color
        customFieldButton.style.color = '#333'; // Inactive button text color
      }
    }
  }
  
  function createCustomFieldButton(field) {
    // Remove existing custom button if present
    if (customFieldButton) {
      customFieldButton.remove();
    }
  
    // Create the button
    customFieldButton = document.createElement('button');
    customFieldButton.className = 'field-btn';
    customFieldButton.setAttribute('data-field', field);
    customFieldButton.textContent = field;
    customFieldButton.style.backgroundColor = '#e0e0e0'; // Default background color
    customFieldButton.style.color = '#333'; // Default text color
  
    // Add event listener to the custom button
    customFieldButton.addEventListener('click', function () {
      chrome.storage.sync.set({ selectedField: field }, function () {
        setActiveField(field);
      });
    });
  
    // Append the custom button to the container
    customFieldButtonContainer.appendChild(customFieldButton);
  }
  

  // Check if the field is predefined
  function isPredefinedField(field) {
    return Array.from(fieldButtons).some(button => button.getAttribute('data-field') === field);
  }
});
