# TA-Chatbot

## Project Description

TA Chatbot is a application that allows teachers to integrate their syllabus into a AI-driven chatbot to provide students an easy way ask questions about the syllabus, assignments, or course materials with quick and accurate responses.

## Contributors
- [Tomer Ozmo](https://github.com/contributor3) - Group Leader
- [Anish Banswada](https://github.com/contributor2) - Code Lead
- [Cameron Smith](https://github.com/csmith2025) - Style Lead
- [Lihn Nguyen](https://github.com/contributor2) - Quality Assurance Lead
- [Shashank Rana](https://github.com/contributor3) - Design Lead
- [Liam Quinlan](https://github.com/contributor1) - Client Lead

## Table Of Contents
- [Project Description](#project-description)
- [Contributors](#contributors)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)

## Prerequisites
- Docker
- Node.js 18+ (for local development)
- Python 3.11 (for local development)
- Git

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/Denison-CS-349-Fall-2024/TA-Chatbot.git
cd TA-Chatbot
```

2. Create a `.env` file in the root directory with the following template:
```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET=your_google_secret

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key

# Database Configuration
POSTGRES_DB=ta_chatbot_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_HOST=db        # Use 'localhost' if running Django locally without Docker
POSTGRES_PORT=5432

# Django Secret Key
DJANGO_SECRET_KEY=your_django_secret_key

# Pinecone API Key
PINECONE_API_KEY=your_pinecone_api_key
```

## Development Setup

### Option 1: Full Local Development

1. Setup Frontend:
```bash
cd frontend
npm install
npm start
```
Frontend will be available at `http://localhost:4200`

2. Setup Backend:
```bash
cd webserver
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend will be available at `http://localhost:8000`

### Option 2: Local Development with Dockerized Database

1. Follow the local development steps above for frontend and backend, but ensure your `.env` file has:
```env
POSTGRES_HOST=localhost  # When running Django locally
```

2. Start only the database container:
```bash
docker compose up db -d
```

## Production Setup

1. Build and run all services using Docker Compose:
```bash
docker compose up --build -d
```

This will:
- Start the PostgreSQL database on port 5432
- Build and run the Django backend on port 8000
- Build and run the Angular frontend on port 4200

2. To stop all services:
```bash
docker compose down
```

3. To view logs:
```bash
docker compose logs -f
```

## Accessing the Application

- Frontend: http://127.0.0.1:4200
- Backend API: http://127.0.0.1:8000
- Admin Interface: http://127.0.0.1:8000/admin

## Notes

- For development with a Dockerized database only, make sure to update the `POSTGRES_HOST` in your `.env` file to `localhost`
- For full Docker deployment, keep `POSTGRES_HOST=db` in your `.env` file
- The production setup uses Nginx to serve the frontend and Gunicorn for the backend