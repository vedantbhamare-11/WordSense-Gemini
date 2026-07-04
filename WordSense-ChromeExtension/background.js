// Handles simple extension toggle states from the popup window
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleExtension') {
    console.log("WordSense Status Adjusted: " + message.isEnabled);
    sendResponse({ success: true });
    // CRITICAL: Tells Chrome we are resolving this synchronously, keeping the link stable
    return false; 
  }
});

// Dedicated cross-origin pipeline for live streaming definitions
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "wordsense-stream-bridge") return;

  // Liveness flag to track if the webpage tooltip is still open and listening
  let isPortConnected = true;
  
  // Create an AbortController instance to kill the HTTP fetch request instantly if needed
  let fetchAbortController = new AbortController();

  // Sentinel Event Listener: Triggers instantly if the user deselects text or closes the tab
  port.onDisconnect.addListener(() => {
    isPortConnected = false;
    fetchAbortController.abort(); // Drops the connection to your Flask app immediately
    print("🔌 Webpage disconnected. Cancelled background stream task.");
  });

  port.onMessage.addListener(async (msg) => {
    if (msg.action !== "fetchFromBackground") return;

    // Reset abort manager for a fresh lookup path
    fetchAbortController = new AbortController();
    isPortConnected = true;

    try {
      const response = await fetch("http://127.0.0.1:5000/get-meaning", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "text/event-stream"
        },
        body: JSON.stringify({ word: msg.word, field: msg.field }),
        signal: fetchAbortController.signal // Link the abort trigger to this network request
      });

      if (!response.body) {
        if (isPortConnected) port.postMessage({ status: "error", data: "Stream pipe initialization failed." });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (isPortConnected) {
        const { value, done } = await reader.read();
        
        // Break out cleanly if the stream finishes naturally
        if (done) {
          if (isPortConnected) port.postMessage({ status: "done" });
          break;
        }

        const textChunk = decoder.decode(value, { stream: true });
        if (textChunk && isPortConnected) {
          // Relays the chunk to content.js only if the tab hasn't disconnected
          port.postMessage({ status: "streaming", data: textChunk });
        }
      }
    } catch (err) {
      // Ignore errors caused by our deliberate abort trigger
      if (err.name === 'AbortError') return;
      
      if (isPortConnected) {
        port.postMessage({ status: "error", data: "Background connection error." });
      }
    }
  });
});