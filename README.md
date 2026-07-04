# 🔍🤖 WordSense AI

**WordSense AI** is a lightweight, zero-latency Google Chrome extension engineered for context-aware reading. Simply highlight any word or multi-word phrase on any webpage—including highly secure developer platforms such as **GitHub**, **dev.to**, or **Medium**—and WordSense instantly displays a concise, one-sentence AI-generated definition tailored strictly to your selected knowledge domain.

Powered by **Groq's ultra-fast LPUs (Language Processing Units)** running **Meta Llama-3.1-8B-Instant**, WordSense delivers blazing-fast streaming responses at **500+ tokens per second** while maintaining minimal resource consumption through strict engineering guardrails.

---

# ✨ Features

## ⚡ Zero-Latency Streaming

WordSense begins streaming definitions immediately after text selection using a real-time typewriter rendering engine, providing an uninterrupted reading experience.

## 🎯 Domain-Specific Context Tuning

Choose from built-in knowledge domains:

* General
* Science
* Medical
* Law
* Computer Science
* Architecture

Or save your own custom domain profile, such as *Cricket*, *Frontend Engineering*, *Cyber Security*, *Finance*, or *Data Science*. Each domain dynamically modifies the AI engine's role prompt to produce definitions specifically relevant to that field.

## 🛡️ Content Security Policy (CSP) Bypass

Many websites enforce strict security protocols that block client-side API requests. WordSense solves this by routing network requests through an isolated browser-level **Background Service Worker**, allowing the extension to function seamlessly on enterprise platforms.

## 🔋 Leak-Proof Resource Management

The extension continuously monitors user activity using an **AbortController** network sentinel loop. Running AI requests are automatically cancelled the instant a user deselects text, clicks elsewhere, switches browser tabs, or starts another selection—aggressively saving your API token quotas.

## 🎨 Premium Glassmorphism Interface

WordSense features a modern cyberpunk-inspired UI layout built using pure CSS variables and hardware-accelerated animations (`requestAnimationFrame`). The floating tooltip remains lightweight while offering a premium visual layout.

## ⚠️ Manifest V3 Standard Compliant

The extension is fully compliant with **Chrome Manifest V3** and is configured precisely against granular permission scopes (`storage`, `activeTab`, explicit host matches) to avoid triggering installation alerts.

---

# 🧠 Latent Capabilities & Linguistic Superpowers

Beyond its core design configurations, the unique architecture of WordSense AI unlocks several emergent semantic and behavioral superpowers:

### 🔄 Advanced Polysemy Resolution (Contextual Disambiguation)
In linguistics, *polysemy* occurs when a single word possesses multiple distinct meanings. While static dictionaries force you to wade through irrelevant text walls, WordSense AI dynamically isolates definitions based on your active viewport environment. Highlighting the token `"Pipeline"` with the **Computer Science** profile active yields a CI/CD automation definition; highlighting it on financial layout spaces transforms it into a sales forecasting definition.

### 🧱 Micro-Phrasal Idiom & Compound Parsing
Standard dictionaries fail when handling complex multi-word idioms, tech jargon, or modern internet slang (e.g., *"biting the bullet"*, *"spilling the beans"*, or engineering slang like *"dogfooding"*). Because the text-selection trigger captures bounded phrases natively, WordSense evaluates the collective semantic weight of compound phrases to deliver an accurate translation instead of broken, word-by-word literal translations.

### 🧪 Living Neologism & Acronym Decoding
Language evolves faster than traditional lexicons can publish updates. WordSense acts as a real-time semantic map, instantly translating cutting-edge industry buzzwords, abbreviations, and developer-shorthand acronyms (*CSP*, *LPU*, *CORS*, or *camelCase* variables) that are completely absent from standard dictionary frameworks.

### 🌐 Cross-Lingual Code-Switching Inferences
Global technical documentation frequently exhibits *code-switching*—interspersing non-English contextual phrases or specialized localized loanwords within standard text bodies. The underlying LLM pipeline acts as an inline hybrid translator, inferring exactly what the foreign token conveys relative to the surrounding English context, keeping reading immersion intact.

### 🛡️ Immune Injection-Proof Sandbox
Because the content script pipeline injects incoming server-sent event (SSE) data streams strictly through non-executable `.textContent` nodes rather than high-risk native parsing engines like `.innerHTML`, it creates a built-in security shield. If an AI provider ever undergoes a prompt injection or streams rogue HTML/JS snippets, the client interface automatically strips away malicious execution, safely rendering it as flat, passive string text.

---

# 🏗️ Project Architecture

```text
WordSense-AI/
│
├── WordSense-Backend/
│   ├── app.py                  # Multi-threaded Flask application & custom UI fallback router
│   ├── requirements.txt        # Production deployment dependency trees
│   ├── Dockerfile              # Container building directives for cloud clusters
│   └── README.md               # Hugging Face deployment spaces metadata header
│
└── WordSense-ChromeExtension/
    ├── manifest.json           # Manifest V3 configurations & safe host allowances
    ├── background.js           # Network worker bridge, port monitor, & abort tracker
    ├── content.js              # Tooltip layout engine, debouncer, & typewriter loop
    ├── popup.html              # Clean dark dashboard window layout
    ├── popup.css               # Cyberpunk neon variables & micro-animations
    ├── popup.js                # Event delegation controller & state sync manager
    ├── icon.png                # Primary extension icon surface
    ├── power-button-on.png     # Active extension state toggle graphic
    └── power-button-off.png    # Inactive extension state toggle graphic
```

# 📂 Directory Overview

## WordSense-Backend

Built using Python 3, Flask, and Gunicorn, this component serves as the core AI inference layer hosted as a Dockerized container web app inside the cloud.

| File             | Description                                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| app.py           | Main Flask application handling requests, Groq connection pooling, prompt engineering, and an integrated landing page fallback dashboard for GET requests. |
| requirements.txt | Pinpoints specific library weights including groq, flask-cors, and gunicorn.                                                                               |
| Dockerfile       | Configures an ultra-light Linux container runtime matrix exposing application traffic on standard Hugging Face server blocks.                              |

## WordSense-ChromeExtension

The client-side package that hooks into the browser layer, tracks user highlight actions, manages extension states, and streams text matrices down to the webpage view frame.

| File                  | Description                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| manifest.json         | Declares background loops, content injection criteria, and allows secure data pipelines directly over https://*.hf.space/. |
| background.js         | Manages network lifecycles, cross-origin communication, and handles AbortController triggers.                              |
| content.js            | Appends the glassmorphic container layout, debounces selection mouse events, and handles the typewriter animation loop.    |
| popup.html / css / js | The control center panel that saves user topic context overrides using standard browser storage syncing.                   |

# 🛠️ Technology Stack

**Frontend Client:** Vanilla JavaScript (ES6+), HTML5, CSS Variables, Chrome Extension API (Manifest V3)

**Backend API Engine:** Python 3, Flask, Flask-CORS, Gunicorn (Multi-threaded cluster worker)

**Cloud Infrastructure:** Hugging Face Spaces (Docker Environment Platform Engine)

**AI Inference Pipeline:** Groq Python SDK (Llama-3.1-8b-instant primary model, Llama-3.3-70b-versatile automatic failover backup tier)

# 🚀 Installation & Launch Guide

## 1. Cloud-Hosted Backend Setup (Hugging Face Spaces)

The backend container is optimized to run serverless in the cloud.

If deploying your own:

* Create a new Docker Space (Blank Template) on Hugging Face.
* In the Space Settings, add a new secret variable named `GROQ_API_KEY` containing your access key.
* Push your backend code structure securely up to the space git remote repository:

```bash
git subtree split --prefix WordSense-Backend -b temp-deploy-branch
git push hf temp-deploy-branch:main --force
```

Your app endpoint will automatically fire up and display a glowing high-tech "Engine Active" landing card at:

```
https://YOUR_USERNAME-wordsense-ai.hf.space/
```

## 2. Chrome Extension Client Setup

* Clone this repository down onto your local machine workspace.
* Open your extension browser configurations tab:

```
chrome://extensions/
```

* Toggle the **Developer mode** switch in the top-right corner to **ON**.
* Click the **Load unpacked** button located in the top-left section.
* Choose the **WordSense-ChromeExtension** folder inside your local directory layout.
* Make sure to refresh any open browser tabs using a hard layout update (**Cmd + Shift + R** or **Ctrl + F5**) to successfully attach the new script hooks.

# ⚙️ Performance Optimizations & Guardrails

### Event Debouncing

Highlighting text initiates an active **300ms cooling window** to check if the user is still dragging their cursor, effectively blocking double-clicks or micro-selections from hammering the API.

### Exact-Word Cache Engine

The extension dynamically remembers your last lookup phrase. If you highlight the exact same string context twice, it instantly skips the web request and re-renders the cached definition block.

### Selection Truncation Metrics

Pure numerical selections are filtered out via regular expressions. Lookups are strictly bound between **3 and 60 characters** with a **maximum threshold of 4 words**—ensuring multi-word idioms function flawlessly while protecting your infrastructure from reading massive paragraph walls.

### Deterministic Inference Tuning

The backend engine forces constraints using:

```text
temperature = 0.1
max_tokens = 64
```

restricting the model from writing long essays and preserving your free-tier daily Tokens Per Minute (TPM) quotas.

# 🔄 System Data Request Flow

```text
User Highlights Text Matrix
          │
          ▼
Selection Criteria Checked (3-60 chars, max 4 words)
          │
          ▼
300ms Performance Cooling Debounce
          │
          ▼
Content Script Captures Target Strings
          │
          ▼
Background Service Worker Secure Bridge Pipeline
          │
          ▼
Cloud Container Service Endpoint (Hugging Face Docker Hub)
          │
          ▼
Groq High-Speed LPU Inference Layer (Llama-3.1-8b-instant Engine)
          │
          ▼
Real-time Server-Sent Event Text Chunk Relays
          │
          ▼
Content Script Hardware Accelerated Typewriter Engine
          │
          ▼
Premium Glassmorphism Float Tooltip Display Surface
```

# 📄 License

This application blueprint is released openly for personal productivity tracking and developer educational exploration matrices.

# 👨‍💻 Engineering Core

* Vanilla JS DOM Frameworks
* Python Flask Event Streaming Architectures
* Docker Virtualized Container Deployments
* Groq Ultra-Fast LPU Inference Platforms
