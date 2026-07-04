# 🔍🤖 WordSense AI

**WordSense AI** is a lightweight, zero-latency Google Chrome extension engineered for context-aware reading. Simply highlight any word or multi-word phrase on any webpage—including highly secure developer platforms such as **GitHub**, **dev.to**, or **Medium**—and WordSense instantly displays a concise, one-sentence AI-generated definition tailored to your selected knowledge domain.

Powered by **Groq's ultra-fast LPUs (Language Processing Units)** running **Meta Llama-3.1-8B-Instant**, WordSense delivers blazing-fast streaming responses at **500+ tokens per second** while maintaining minimal resource consumption through strict engineering guardrails.

---

# ✨ Features

## ⚡ Zero-Latency Streaming

WordSense begins streaming definitions immediately after text selection using a real-time typewriter rendering engine, providing an uninterrupted reading experience.

---

## 🎯 Domain-Specific Context Tuning

Choose from built-in knowledge domains:

- General
- Science
- Medical
- Law
- Computer Science
- Architecture

Or create your own custom domain such as:

- Cricket
- Frontend Engineering
- Cyber Security
- Finance
- Data Science

Each domain dynamically modifies the AI prompt to produce definitions specifically relevant to that field.

---

## 🛡️ CSP Security Bypass

Many websites enforce strict **Content Security Policies (CSP)** that block client-side API requests.

WordSense solves this by routing all network requests through an isolated **Background Service Worker**, allowing the extension to function seamlessly on platforms including:

- GitHub
- Medium
- dev.to
- Documentation websites
- Enterprise applications

---

## 🔋 Leak-Proof Resource Management

The extension continuously monitors user activity using **AbortController**.

Running AI requests are automatically cancelled whenever the user:

- deselects text
- clicks elsewhere
- switches browser tabs
- starts another selection

This prevents unnecessary API usage while keeping the interface highly responsive.

---

## 🎨 Premium Glassmorphism Interface

WordSense features a modern cyberpunk-inspired UI built using:

- Glassmorphism
- CSS Variables
- Hardware Accelerated Animations
- requestAnimationFrame
- Responsive Layout Scaling

The floating tooltip remains lightweight while offering a premium visual experience.

---

## ⚠️ Manifest V3 Ready

The extension is fully compliant with **Chrome Manifest V3** and uses only the minimum required permissions:

- storage
- activeTab
- Explicit host permissions

This avoids unnecessary installation warnings while maintaining strong security.

---

# 🏗️ Project Architecture

```text
WordSense-Gemini/
│
├── WordSense-Backend/
│   ├── app.py                  # Flask backend server, AI inference, prompt management
│   └── requirements.txt        # Python dependencies
│
└── WordSense-ChromeExtension/
    ├── manifest.json           # Chrome Extension Manifest V3 configuration
    ├── background.js           # Background service worker, API bridge, request handling
    ├── content.js              # Text selection detection, tooltip rendering, streaming UI
    ├── popup.html              # Extension popup interface
    ├── popup.css               # Popup styling and glassmorphism theme
    ├── popup.js                # Popup interactions and settings management
    ├── icon.png                # Extension icon
    ├── power-button-on.png     # Enabled state icon
    └── power-button-off.png    # Disabled state icon
```

---

# 📂 Directory Overview

## WordSense-Backend

The backend is built using **Python** and **Flask**, serving as the AI inference layer responsible for processing highlighted text and returning concise, domain-aware definitions.

### Files

| File | Description |
|------|-------------|
| **app.py** | Main Flask application handling API requests, prompt engineering, AI model communication, and response generation. |
| **requirements.txt** | Lists all required Python packages and project dependencies. |

---

## WordSense-ChromeExtension

The Chrome Extension provides the user interface, captures highlighted text, communicates with the backend, and displays streamed AI responses inside a floating tooltip.

### Files

| File | Description |
|------|-------------|
| **manifest.json** | Chrome Manifest V3 configuration, permissions, content scripts, and background service worker registration. |
| **background.js** | Acts as the secure communication bridge between the extension and backend while handling request lifecycle management. |
| **content.js** | Detects text selections, validates input, renders the floating tooltip, and streams AI-generated definitions. |
| **popup.html** | Main extension popup UI displayed when clicking the extension icon. |
| **popup.css** | Styles the popup interface using a modern dark theme and glassmorphism effects. |
| **popup.js** | Handles popup interactions, domain selection, extension state, and local storage synchronization. |
| **icon.png** | Primary Chrome extension icon. |
| **power-button-on.png** | Indicates the extension is enabled. |
| **power-button-off.png** | Indicates the extension is disabled. |


## WordSense-ChromeExtension

### manifest.json

- Chrome Manifest V3 configuration
- Required permissions
- Content scripts
- Background service worker
- Host permissions

---

### background.js

Responsible for:

- API communication
- CSP bypass
- AbortController management
- Request cancellation
- Message bridge between content scripts and backend

---

### content.js

Handles:

- Text selection detection
- Floating tooltip rendering
- Streaming typewriter animation
- Position calculations
- Debouncing
- Selection validation

---

### popup.html

Provides the extension popup interface where users can:

- Enable or disable WordSense
- Select AI domain
- Configure custom domains

---

### popup.css

Contains:

- Dark theme styling
- Glassmorphism
- Animations
- Responsive layouts
- CSS Variables

---

### popup.js

Manages:

- Popup events
- Local storage
- Domain switching
- User preferences
- State synchronization

---

# 🐍 WordSense-Backend

## app.py

Python Flask server responsible for:

- Groq API integration
- Prompt engineering
- Domain-specific prompting
- Streaming AI responses
- Multi-model fallback
- Connection pooling

---

## requirements.txt

Contains Python dependencies such as:

- Flask
- Flask-CORS
- groq
- python-dotenv

---

## .env

Stores private credentials:

```env
GROQ_API_KEY=gsk_your_key_here
```

---

# 🛠️ Technology Stack

## Frontend

- Vanilla JavaScript (ES6+)
- HTML5
- CSS3
- Chrome Extension APIs
- Manifest V3

---

## Backend

- Python 3
- Flask
- Flask-CORS
- Python Dotenv

---

## AI Engine

Primary Model:

- Meta Llama-3.1-8B-Instant

Backup Model:

- Meta Llama-3.3-70B-Versatile

Hosted on:

- Groq LPUs

---

# 🚀 Installation Guide

## 1. Clone the Project

```bash
git clone <repository-url>
```

---

## 2. Navigate to Backend

```bash
cd WordSense-Backend
```

---

## 3. Create Virtual Environment

```bash
python3 -m venv venv
```

---

## 4. Activate Environment

### macOS/Linux

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

---

## 5. Install Dependencies

```bash
pip install --no-cache-dir -r requirements.txt
```

---

## 6. Create Environment File

Create a file named:

```text
.env
```

Add your Groq API key:

```env
GROQ_API_KEY=gsk_your_actual_key_here
```

---

## 7. Start Backend

```bash
python3 app.py
```

Backend will be available at:

```
http://127.0.0.1:5000
```

---

# 🌐 Install Chrome Extension

Open:

```
chrome://extensions
```

Enable:

```
Developer Mode
```

Click:

```
Load Unpacked
```

Select:

```
WordSense-ChromeExtension
```

After installation:

- Open any webpage
- Force refresh the page

### macOS

```
Cmd + Shift + R
```

### Windows

```
Ctrl + F5
```

---

# ⚙️ Performance Optimizations

## Event Debouncing

After every text selection, WordSense waits:

```
300 milliseconds
```

before sending a request.

This avoids:

- accidental drags
- double clicks
- repeated API calls

---

## Exact Word Cache

The extension remembers the last successful lookup.

If the same word is selected again:

- API request is skipped
- Cached state is used

This significantly reduces API consumption.

---

## Selection Validation

Only valid selections are processed.

Rules:

- Minimum length: **3 characters**
- Maximum length: **60 characters**
- Maximum words: **4**
- Pure numbers are ignored

Examples:

✅ Artificial Intelligence

✅ Arm Ball

✅ Back Foot

❌ 123456

❌ Entire paragraphs

---

## Deterministic AI Responses

The backend uses:

```python
temperature = 0.1
max_tokens = 64
```

Benefits include:

- concise definitions
- consistent responses
- lower token usage
- free-tier friendly

---

# 🔄 Request Flow

```text
User Highlights Text
          │
          ▼
Selection Validation
          │
          ▼
300ms Debounce
          │
          ▼
Content Script
          │
          ▼
Background Service Worker
          │
          ▼
Flask Backend
          │
          ▼
Groq API
          │
          ▼
Streaming Response
          │
          ▼
Typewriter Renderer
          │
          ▼
Floating Tooltip
```

---

# 🎯 Supported Domains

- General
- Science
- Medical
- Law
- Computer Science
- Architecture
- Custom Domain

Examples of custom domains:

- Cricket
- Frontend Engineering
- DevOps
- Machine Learning
- Cyber Security
- Finance
- Economics
- Biology
- Chemistry
- Physics

---

# 🚀 Why WordSense AI?

- ⚡ Instant AI-powered definitions
- 🧠 Context-aware explanations
- 🌐 Works across nearly all websites
- 🔒 Secure Manifest V3 architecture
- 🛡️ CSP-compliant request routing
- 💡 Lightweight and optimized
- 🎨 Beautiful glassmorphism interface
- 🔋 Minimal API usage
- ⚙️ Smart request cancellation
- 📚 Domain-aware learning experience

---

# 📄 License

This project is intended for educational and personal productivity purposes.

---

## 👨‍💻 Built With

- Chrome Extension Manifest V3
- Vanilla JavaScript
- HTML5
- CSS3
- Python
- Flask
- Groq API
- Meta Llama Models

---

**WordSense AI** transforms everyday reading into an intelligent, context-aware learning experience by delivering lightning-fast AI definitions exactly when you need them.
