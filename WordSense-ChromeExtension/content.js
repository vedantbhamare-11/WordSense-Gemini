// Dummy word meanings (for testing, remove once backend is used)
const dummyMeanings = {
  "JavaScript": "A high-level, dynamic programming language.",
  "HTML": "The standard markup language for creating web pages.",
  "CSS": "A stylesheet language used to describe the presentation of a document written in HTML."
};

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
document.body.appendChild(tooltip);

// Function to show tooltip with word meaning
function showTooltip(event, meaning) {
  tooltip.textContent = meaning;
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY + 10}px`;
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
      if (data.status === "processing") {
        showTooltip(event, data.message); // Display processing message
        waitForResult(word, event);
      } else {
        showTooltip(event, "Error fetching the meaning.");
      }
    })
    .catch((error) => {
      console.error("Error fetching meaning:", error);
      showTooltip(event, "Error fetching the meaning.");
    });
}

// Detect selected text and fetch meaning
document.addEventListener("mouseup", (event) => {
  const selectedText = window.getSelection().toString().trim();
  
  if (selectedText) {
    if (dummyMeanings[selectedText]) {
      // Use dummy data if available
      showTooltip(event, dummyMeanings[selectedText]);
    } else {
      // Fetch from backend if not in dummy data
      fetchMeaningFromAPI(selectedText, event);
    }
  } else {
    hideTooltip();
  }
});

// Hide tooltip when clicking elsewhere
document.addEventListener("mousedown", hideTooltip);
