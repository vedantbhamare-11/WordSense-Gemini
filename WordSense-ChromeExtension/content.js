// 1. Append global standalone isolated custom dynamic glassmorphism tooltip surface
const tooltip = document.createElement("div");
tooltip.id = "wordsense-tooltip";
tooltip.style.position = "absolute";
tooltip.style.padding = "10px 14px";
tooltip.style.backgroundColor = "rgba(22, 25, 32, 0.96)"; 
tooltip.style.backdropFilter = "blur(12px)"; 
tooltip.style.webkitBackdropFilter = "blur(12px)";
tooltip.style.color = "#f3f4f6"; 
tooltip.style.borderRadius = "8px";
tooltip.style.display = "none";
tooltip.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
tooltip.style.fontSize = "15px"; 
tooltip.style.lineHeight = "1.6"; 
tooltip.style.zIndex = "2147483647"; 
tooltip.style.maxWidth = "320px";  
tooltip.style.wordWrap = "break-word"; 
tooltip.style.whiteSpace = "normal";
tooltip.style.boxShadow = "0px 12px 32px rgba(0, 0, 0, 0.5)"; 
tooltip.style.border = "1px solid #262c3a"; 
tooltip.style.opacity = "0";
tooltip.style.transition = "opacity 0.15s ease"; // Hardware-accelerated entry transitions
document.body.appendChild(tooltip);

// 2. Inject optimized tracking keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .ws-loading { display: inline-flex; align-items: center; gap: 4px; height: 12px; padding: 2px 4px; }
  .ws-dot { width: 4px; height: 4px; background-color: #01adb5; border-radius: 50%; animation: wsJump 0.5s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); }
  .ws-dot:nth-child(2) { animation-delay: 0.12s; }
  .ws-dot:nth-child(3) { animation-delay: 0.24s; }
  @keyframes wsJump { 0% { transform: translateY(2px); } 100% { transform: translateY(-4px); } }
`;
document.head.appendChild(styleSheet);

// 3. Core Engine State Matrix
const definitionCache = {};
let selectionDebounceTimeout = null;
let typewriterInterval = null; // Global tracking reference to prevent background memory loops
let isCurrentlyFetching = false; 
let lastSuccessfulWord = "";        

function showTooltip(event, contentIsHTML, rawTextOrHTML) {
  if (contentIsHTML) { tooltip.innerHTML = rawTextOrHTML; } 
  else { tooltip.textContent = rawTextOrHTML; }
  
  tooltip.style.display = "block";
  
  // Use requestAnimationFrame to prevent layout thrashing during browser draw phase
  requestAnimationFrame(() => {
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = event.pageX + 12;
    let top = event.pageY - tooltipRect.height - 12;
    
    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - 16;
    }
    if (top < 0) {
      top = event.pageY + 16;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.opacity = "1";
  });
}

function resetTypewriter() {
  if (typewriterInterval) {
    clearInterval(typewriterInterval);
    typewriterInterval = null;
  }
}

function hideTooltip() { 
  resetTypewriter();
  tooltip.style.opacity = "0";
  // Delay removing layout visibility slightly to allow smooth fade out transition
  setTimeout(() => {
    if (tooltip.style.opacity === "0") tooltip.style.display = "none";
  }, 150);
}

async function fetchMeaningFromAPI(word, event) {
  if (!chrome.runtime?.connect) return;
  if (isCurrentlyFetching) return; 

  // Clean the active animation engine state completely before spinning up a new pipe stream
  resetTypewriter();

  chrome.storage.sync.get('selectedField', async function (data) {
    if (chrome.runtime.lastError) return;

    const field = data.selectedField ?? 'General';
    const cacheKey = `${word.toLowerCase()}_${field}`;

    if (definitionCache[cacheKey]) {
      showTooltip(event, false, definitionCache[cacheKey]);
      return;
    }

    isCurrentlyFetching = true;
    lastSuccessfulWord = word;

    showTooltip(event, true, `<div class="ws-loading"><div class="ws-dot"></div><div class="ws-dot"></div><div class="ws-dot"></div></div>`);

    const port = chrome.runtime.connect({ name: "wordsense-stream-bridge" });
    
    let fullCompiledText = "";
    let wordQueue = [];
    let currentDisplayedText = "";
    let isTypingLoopActive = false;

    function startTypingEngine() {
      if (isTypingLoopActive || wordQueue.length === 0) return;
      isTypingLoopActive = true;

      typewriterInterval = setInterval(() => {
        if (wordQueue.length > 0) {
          currentDisplayedText += (currentDisplayedText ? " " : "") + wordQueue.shift();
          showTooltip(event, false, currentDisplayedText);
        } else {
          resetTypewriter();
          isTypingLoopActive = false;
        }
      }, 35);
    }

    port.onMessage.addListener((message) => {
      if (message.status === "streaming") {
        if (fullCompiledText === "") tooltip.innerHTML = ""; 
        
        fullCompiledText += message.data;
        wordQueue.push(...message.data.split(/\s+/).filter(w => w.length > 0));
        startTypingEngine();
      } 
      else if (message.status === "done") {
        definitionCache[cacheKey] = fullCompiledText;
        isCurrentlyFetching = false;
        port.disconnect();
      } 
      else if (message.status === "error") {
        showTooltip(event, false, "Connection drop. Please re-select.");
        isCurrentlyFetching = false;
        port.disconnect();
      }
    });

    port.postMessage({ action: "fetchFromBackground", word, field });
  });
}

document.addEventListener("mouseup", (event) => {
  if (selectionDebounceTimeout) clearTimeout(selectionDebounceTimeout);

  selectionDebounceTimeout = setTimeout(() => {
    if (!chrome.runtime?.id) return;

    chrome.storage.sync.get('isExtensionEnabled', function (data) {
      if (chrome.runtime.lastError || !(data.isExtensionEnabled ?? true)) return;

      const selectedText = window.getSelection().toString().trim();
      const isPureNumber = /^\d+$/.test(selectedText);
      const wordCount = selectedText.split(/\s+/).filter(w => w.length > 0).length;

      if (selectedText && selectedText.length >= 3 && selectedText.length < 60 && !isPureNumber && wordCount <= 4) {
        if (selectedText.toLowerCase() === lastSuccessfulWord.toLowerCase()) return;
        fetchMeaningFromAPI(selectedText, event);
      } else if (!selectedText) {
        hideTooltip();
        lastSuccessfulWord = "";
      }
    });
  }, 300); 
});

document.addEventListener("mousedown", (event) => {
  if (event.target.id !== "wordsense-tooltip") hideTooltip();
});