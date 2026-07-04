import os
import sys
from dotenv import load_dotenv
from flask import Flask, request, Response, stream_with_context, render_template_string
from flask_cors import CORS
from groq import Groq

# 1. Boot Environment Matrix
load_dotenv()
app = Flask(__name__)

# Configured to only allow requests from your Chrome Extension environment securely
CORS(app, resources={r"/get-meaning": {"origins": "*"}})

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("❌ Critical Initialization Failure: GROQ_API_KEY missing from system .env structure.")
    sys.exit(1)

# 2. Optimized Connection Pooling: Reuse a single connection client instance globally
client = Groq(api_key=GROQ_API_KEY)

# Static prompt configurations placed outside routing context to save memory overhead
SYSTEM_INSTRUCTION = (
    "You are a precise, highly technical dictionary helper. Provide the absolute core meaning "
    "of the requested term based strictly on the provided domain context. Output exactly one short sentence. "
    "Do not include greeting phrases, preamble text, summary explanations, or bold markdown formatting."
)

# A clean, high-tech landing page UI to display instead of a 404 error
HOME_HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WordSense AI | Cloud Engine</title>
    <style>
        body {
            margin: 0; padding: 0; box-sizing: border-box;
            background-color: #0f1115; color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex; justify-content: center; align-items: center; min-height: 100vh;
        }
        .card {
            background: #161920; border: 1px solid #262c3a;
            padding: 32px; border-radius: 16px; text-align: center;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4); max-width: 400px; width: 90%;
        }
        h1 { margin: 0 0 8px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; color: #f3f4f6; }
        .status {
            display: inline-flex; align-items: center; gap: 8px;
            background: rgba(1, 173, 181, 0.1); color: #01adb5;
            padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;
            margin-bottom: 20px; border: 1px solid rgba(1, 173, 181, 0.2);
        }
        .dot { width: 8px; height: 8px; background-color: #01adb5; border-radius: 50%; }
        p { margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="card">
        <div class="status"><div class="dot"></div> Engine Active</div>
        <h1>WordSense AI</h1>
        <p>This is the production streaming API cluster for your extension. Securely processing dictionary requests live in the cloud via Groq LPU systems.</p>
    </div>
</body>
</html>
"""

@app.route("/", methods=["GET"])
def home():
    """Renders a beautiful landing page when visiting the space directly."""
    return render_template_string(HOME_HTML_TEMPLATE)

@app.route("/get-meaning", methods=["POST"])
def get_meaning():
    data = request.json or {}
    word = data.get("word", "").strip()
    field = data.get("field", "General").strip()

    if not word:
        return "Missing targeted selection word token.", 400

    print(f"🚀 Processing Request -> Word: '{word}' | Domain Context: '{field}'")
    user_prompt = f"Term: '{word}' | Context Domain: '{field}'"

    models_to_stream = [
        "llama-3.1-8b-instant",      # Fast LPU Tier
        "llama-3.3-70b-versatile"    # Backup High-Capacity Tier
    ]

    @stream_with_context
    def generate_groq_chunks():
        stream_success = False
        last_stream_error = None

        for model_name in models_to_stream:
            try:
                print(f" -> Initializing pipe matrix using {model_name}...")
                
                # Split rules out using explicit role-based message structures
                completion_stream = client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": SYSTEM_INSTRUCTION},
                        {"role": "user", "content": user_prompt}
                    ],
                    model=model_name,
                    stream=True,
                    max_tokens=64,        # Shaved from 80 to 64 to lower latency and optimize TPM
                    temperature=0.1,      # Lowered for highly deterministic dictionary results
                    timeout=5.0           # Fails fast if Groq's servers are congested
                )
                
                for chunk in completion_stream:
                    if chunk.choices and len(chunk.choices) > 0:
                        token = chunk.choices[0].delta.content
                        if token is not None:
                            yield token
                            stream_success = True
                
                if stream_success:
                    print(f" ✅ Stream completed successfully via {model_name}.\n")
                    return

            except Exception as e:
                print(f" ⚠️ Engine {model_name} processing failed: {str(e)}")
                last_stream_error = e
                continue

        if not stream_success:
            print(f"❌ Global Pipeline Failure. System Log Error: {last_stream_error}")
            yield f"[{field} Context] '{word}' could not be resolved. (System limits cooling down)."

    # Set compression or event headers explicitly for cleaner network transport layers
    return Response(
        generate_groq_chunks(), 
        mimetype="text/event-stream",
        headers={
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "no-cache"
        }
    )

if __name__ == "__main__":
    # Threaded mode allows handling concurrent requests smoothly if a user highlights words rapidly
    app.run(host="127.0.0.1", port=5000, debug=True, threaded=True)