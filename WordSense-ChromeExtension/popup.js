document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM element selection tokens up front
  const toggleButton = document.getElementById('toggle-btn');
  const toggleIcon = document.getElementById('toggle-icon');
  const customFieldInput = document.getElementById('custom-field-input');
  const saveCustomFieldButton = document.getElementById('save-custom-field');
  const customFieldButtonContainer = document.getElementById('custom-field-button-container');
  const resetCustomFieldButton = document.getElementById('reset-custom-field');
  
  // Use a query selector list to manage state classes elegantly
  const fieldButtons = document.querySelectorAll('.field-btn');

  let customFieldButton = null;

  // 1. Unified State Initializer: Sync states from storage cache on load
  chrome.storage.sync.get(['isExtensionEnabled', 'selectedField'], (data) => {
    const isExtensionEnabled = data.isExtensionEnabled ?? true;
    const selectedField = data.selectedField ?? 'General';

    // Update power switch state class
    toggleButton.className = isExtensionEnabled ? "on" : "off";
    toggleIcon.src = isExtensionEnabled ? "power-button-on.png" : "power-button-off.png";

    // Initialize custom tags if saved previously
    if (selectedField && !isPredefinedField(selectedField)) {
      createCustomFieldButton(selectedField);
    }
    
    setActiveFieldUI(selectedField);
  });

  // 2. Main System Toggle Configuration Switch
  toggleButton.addEventListener('click', () => {
    chrome.storage.sync.get('isExtensionEnabled', (data) => {
      const isEnabled = data.isExtensionEnabled ?? true;
      const newState = !isEnabled;

      chrome.storage.sync.set({ isExtensionEnabled: newState }, () => {
        toggleButton.className = newState ? "on" : "off";
        toggleIcon.src = newState ? "power-button-on.png" : "power-button-off.png";
      });
    });
  });

  // 3. Event Delegation Strategy: Listen for clicks on the main button grid container
  document.querySelector('.field-buttons').addEventListener('click', (event) => {
    const targetButton = event.target.closest('.field-btn');
    if (!targetButton) return;

    const selectedField = targetButton.getAttribute('data-field');
    chrome.storage.sync.set({ selectedField }, () => {
      setActiveFieldUI(selectedField);
    });
  });

  // 4. Custom Field Submission Handler
  const handleCustomFieldSave = () => {
    const customField = customFieldInput.value.trim();
    if (!customField) return;

    chrome.storage.sync.set({ selectedField: customField }, () => {
      createCustomFieldButton(customField);
      setActiveFieldUI(customField);
      customFieldInput.value = '';
    });
  };

  saveCustomFieldButton.addEventListener('click', handleCustomFieldSave);
  
  // Allows pressing 'Enter' in the input box to save the field automatically
  customFieldInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCustomFieldSave();
  });

  // 5. Complete Custom Field Reset Task
  resetCustomFieldButton.addEventListener('click', () => {
    if (customFieldButton) {
      customFieldButton.remove();
      customFieldButton = null;
    }
    chrome.storage.sync.set({ selectedField: 'General' }, () => {
      setActiveFieldUI('General');
      customFieldInput.value = '';
    });
  });

  // --- Utility Functions ---

  function setActiveFieldUI(field) {
    // Loop through predefined static field buttons
    fieldButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-field') === field);
    });
  
    // Synchronize custom element tag class state if active
    if (customFieldButton) {
      customFieldButton.classList.toggle('active', customFieldButton.getAttribute('data-field') === field);
    }
  }
  
  function createCustomFieldButton(field) {
    if (customFieldButton) customFieldButton.remove();
  
    customFieldButton = document.createElement('button');
    customFieldButton.className = 'field-btn'; 
    customFieldButton.setAttribute('data-field', field);
    customFieldButton.textContent = `✨ ${field}`;
  
    customFieldButton.addEventListener('click', () => {
      chrome.storage.sync.set({ selectedField: field }, () => {
        setActiveFieldUI(field);
      });
    });
  
    customFieldButtonContainer.appendChild(customFieldButton);
  }

  function isPredefinedField(field) {
    return Array.from(fieldButtons).some(btn => btn.getAttribute('data-field') === field);
  }
});