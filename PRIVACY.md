# Privacy Policy for WordSense AI

**Effective Date:** July 4, 2026

WordSense AI ("we", "our", "the extension") is committed to maintaining strong privacy protections for its users. This Privacy Policy explains how information is handled when you use our Google Chrome extension.

## 1. Information Collection and Processing

WordSense AI does not collect, track, or harvest any personally identifiable information (PII), such as names, email addresses, IP logs, or cross-site browsing history.

To provide its core functionality, the extension transiently processes the specific text strings that you explicitly highlight and select. This selection data is securely routed via a background script worker to our dedicated API hosted on Hugging Face Spaces for real-time translation and dictionary lookup processing.

## 2. Data Retention and Sharing

- **No Data Retention:** Highlighted text tokens are processed purely in-memory on our server cluster and are immediately discarded after transmitting the definition stream back to your browser layer. No user history database is maintained.
- **Third-Party Processing:** Text queries are sent directly to the Groq API infrastructure strictly for processing natural language definitions. This data is never rented, shared, sold, or used for tracking or marketing purposes.
- **Local Storage:** The extension utilizes local browser-level storage hooks solely to save your local configuration preferences (such as your current application toggle switch state and selected knowledge domain topic filters).

## 3. Compliance with Developer Program Policies

WordSense AI complies fully with the Chrome Web Store's Limited Use and Disclosure Requirements policies. Data is monitored and restricted strictly to fulfill the extension's explicit, disclosed single educational purpose.

## 4. Contact and Support

If you have any questions or bug reports regarding our privacy standards, you can open an issue directly on our official public GitHub repository: https://github.com/vedantbhamare/WordSense-AI
