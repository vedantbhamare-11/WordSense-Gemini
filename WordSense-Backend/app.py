from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()  # This will load variables from .env into environment
app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from any origin

# Retrieve your API key from environment variable
API_KEY = os.getenv("API_KEY")

# Check if the key is found
if not API_KEY:
    raise ValueError("No API key found. Please set API_KEY in your .env file.")

# Configure Gemini API with your API key
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")


@app.route('/get-meaning', methods=['POST'])
def get_meaning():
    data = request.json
    word = data.get('word', '')
    field = data.get('field', 'General')

    if not word:
        return jsonify({"error": "No word provided."}), 400

    # Prepare the prompt to request meaning based on the selected field
    prompt = f"Give the meaning of the word '{word}' in the field of '{field}' in a single sentence."

    try:
        # Make the API call to Gemini
        response = model.generate_content(prompt)
        print("API Response:", response)  # Debugging print, remove in production

        # Extract the text from the response
        if hasattr(response, 'text'):
            meaning = response.text
        else:
            meaning = "Meaning not found in the response."

        return jsonify({"meaning": meaning})

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "An error occurred while fetching the meaning."}), 500


if __name__ == '__main__':
    app.run(debug=True)
