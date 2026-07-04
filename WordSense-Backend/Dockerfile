# Use a lightweight official Python environment image matrix
FROM python:3.11-slim

# Set system directory environment configurations inside the container
WORKDIR /app

# Copy dependency mappings and install them cleanly
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your local application files into the build frame
COPY . .

# Expose port 7860 (Hugging Face spaces require web containers to listen on port 7860)
EXPOSE 7860

# Launch the app using Gunicorn to handle concurrent multi-threaded stream pipelines smoothly
CMD ["gunicorn", "--workers", "2", "--threads", "4", "--bind", "0.0.0.0:7860", "app:app"]