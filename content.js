// Dummy word meanings
const dummyMeanings = {
    "JavaScript": "A high-level, dynamic programming language.",
    "HTML": "The standard markup language for creating web pages.",
    "CSS": "A stylesheet language used to describe the presentation of a document written in HTML."
  };
  
  // Create tooltip element
  const tooltip = document.createElement("div");
  tooltip.id = "word-tooltip";
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
  
  // Detect selected text
  document.addEventListener("mouseup", (event) => {
    const selectedText = window.getSelection().toString().trim();
    if (dummyMeanings[selectedText]) {
      showTooltip(event, dummyMeanings[selectedText]);
    } else {
      hideTooltip();
    }
  });
  
  // Hide tooltip when clicking elsewhere
  document.addEventListener("mousedown", hideTooltip);
  