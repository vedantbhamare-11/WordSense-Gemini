// ./WordSense-ChromeExtension/content.js
// Create tooltip element
const tooltip = document.createElement("div");
tooltip.id = "word-tooltip";
tooltip.style.position = "absolute";
tooltip.style.padding = "8px";
tooltip.style.backgroundColor = "#333";
tooltip.style.color = "#fff";
tooltip.style.borderRadius = "8px";
tooltip.style.display = "none";
tooltip.style.fontFamily = "Arial, sans-serif";
tooltip.style.fontSize = "16px";
tooltip.style.zIndex = "1000";
tooltip.style.maxWidth = "300px";  
tooltip.style.wordWrap = "break-word"; 
tooltip.style.whiteSpace = "normal";
document.body.appendChild(tooltip);

// Function to show tooltip with word meaning
function showTooltip(event, meaning) {
  tooltip.textContent = meaning;

  // Get the tooltip's height before positioning
  tooltip.style.display = "block";
  const tooltipRect = tooltip.getBoundingClientRect();
  
  // Calculate tooltip position above the selected word
  let tooltipLeft = event.pageX + 10;
  let tooltipTop = event.pageY - tooltipRect.height - 10;  // Position above the cursor

  // Check if the tooltip goes off the screen horizontally (right edge)
  const windowWidth = window.innerWidth;
  if (tooltipLeft + tooltipRect.width > windowWidth) {
    tooltipLeft = windowWidth - tooltipRect.width - 10;  // Align to the right side if overflowing
  }

  // Check if the tooltip goes off the screen vertically (top edge)
  if (tooltipTop < 0) {
    tooltipTop = event.pageY + 10;  // If not enough space above, show it below the cursor
  }

  // Set the tooltip position
  tooltip.style.left = `${tooltipLeft}px`;
  tooltip.style.top = `${tooltipTop}px`;

  // Display the tooltip
  tooltip.style.display = "block";
}


// Function to hide tooltip
function hideTooltip() {
  tooltip.style.display = "none";
}

// Function to fetch meaning from Flask backend
function fetchMeaningFromAPI(word, event) {
  chrome.storage.sync.get('selectedField', function (data) {
    const field = data.selectedField ?? 'General'; // Default to General if not set
    const url = "http://127.0.0.1:5000/get-meaning";
    const payload = { word, field };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        if (data.meaning) {
          showTooltip(event, data.meaning);
        } else if (data.error) {
          showTooltip(event, data.error);
        } else {
          showTooltip(event, "No meaning found.");
        }
      })
      .catch(() => showTooltip(event, "Error fetching the meaning."));
  });
}



// Detect selected text and fetch meaning
document.addEventListener("mouseup", (event) => {
  chrome.storage.sync.get('isExtensionEnabled', function (data) {
    const isExtensionEnabled = data.isExtensionEnabled ?? true; // Default to true if not set

    if (!isExtensionEnabled) {
      hideTooltip();
      return; // Don't do anything if the extension is turned off
    }

    const selectedText = window.getSelection().toString().trim();
    
    if (selectedText) {
      // Use dummy data or fetch from backend
      fetchMeaningFromAPI(selectedText, event);
    } else {
      hideTooltip();
    }
  });
});

// Hide tooltip when clicking elsewhere
document.addEventListener("mousedown", hideTooltip);
