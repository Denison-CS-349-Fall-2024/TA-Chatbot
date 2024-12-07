# Base Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files into the container
COPY . .

# Make sure manage.py is executable
RUN chmod +x manage.py

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Change the working directory to where manage.py is located
WORKDIR /app/webserver

# Run Gunicorn
ENTRYPOINT ["gunicorn", "--bind", "0.0.0.0:8000", "webserver.wsgi:application"]