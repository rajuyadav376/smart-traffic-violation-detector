# Bulletproof Dockerfile for Railway / Render / Cloud Deployment
FROM python:3.11-slim

WORKDIR /app

# Install minimal media & system libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libsm6 \
    libxext6 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application source code
COPY backend/ ./backend/

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "python -m uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
