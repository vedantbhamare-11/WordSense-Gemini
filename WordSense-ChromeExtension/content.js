// Create tooltip element
const tooltip = document.createElement("div");
tooltip.id = "word-tooltip";
tooltip.style.position = "absolute";
tooltip.style.padding = "8px";
tooltip.style.backgroundColor = "#333";
tooltip.style.color = "#fff";
tooltip.style.borderRadius = "4px";
tooltip.style.display = "none";
tooltip.style.fontSize = "14px";
tooltip.style.zIndex = "1000";
tooltip.style.maxWidth = "300px";  // Set a maximum width for the tooltip
tooltip.style.wordWrap = "break-word";  // Ensure text breaks to the next line if too long
tooltip.style.whiteSpace = "normal"; // Allow wrapping instead of one single line
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
  const url = "http://127.0.0.1:5000/get-meaning";
  const payload = { word };

  console.log("Sending request to:", url);
  console.log("Payload:", payload);

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      console.log("Received response:", response);
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data);
      if (data.meaning) {
        showTooltip(event, data.meaning);
      } else if (data.error) {
        showTooltip(event, data.error);
      } else {
        showTooltip(event, "No meaning found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching meaning:", error);
      showTooltip(event, "Error fetching the meaning.");
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
