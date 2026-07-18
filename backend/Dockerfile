FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set up a new user named "user" with user ID 1000
# Hugging Face Spaces run as a non-root user
RUN useradd -m -u 1000 user
USER user

# Set home and path
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Install Python dependencies
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY --chown=user . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=$HOME/app

# Expose port 7860 (Required by Hugging Face)
EXPOSE 7860

# Start application
CMD uvicorn app.main:app --host 0.0.0.0 --port 7860
