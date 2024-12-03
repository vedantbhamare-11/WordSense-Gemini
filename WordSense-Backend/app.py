from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from any origin

# Configure Gemini API with your API key
genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route('/get-meaning', methods=['POST'])
def get_meaning():
    data = request.json
    word = data.get('word', '')
    
    if not word:
        return jsonify({"error": "No word provided."}), 400

    # Prepare the prompt to request meaning
    prompt = f"Give the meaning of the word '{word}'."

    try:
        # Make the API call to Gemini
        response = model.generate_content(prompt)
        print("API Response:", response)  # Debugging print, remove in production

        # Check for the structure of the response and extract meaning
        meaning = "Meaning not found."
        if hasattr(response, '_result') and hasattr(response._result, 'candidates'):
            candidates = response._result.candidates
            if candidates:
                content = candidates[0].content  # First candidate content
                if content and hasattr(content, 'parts'):
                    meaning_parts = content.parts
                    if meaning_parts:
                        meaning = meaning_parts[0].text  # Extract meaning from the first part
                    else:
                        meaning = "No detailed meaning found."
                else:
                    meaning = "No content parts available."
            else:
                meaning = "No candidates returned from the API."
        else:
            meaning = "Invalid response from the API."

        return jsonify({"meaning": meaning})

    except Exception as e:
        # Catching unexpected errors and returning them as a response
        print(f"Error occurred: {e}")
        return jsonify({"error": "An error occurred while fetching the meaning."}), 500

if __name__ == '__main__':
    app.run(debug=True)
