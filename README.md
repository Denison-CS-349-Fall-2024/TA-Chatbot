# TA-Chatbot

TA Chatbot is an innovative educational tool designed to streamline course communication between professors and students. This platform enables professors to create personalized AI teaching assistants for their courses by uploading course materials such as syllabi, assignments, lecture notes, and other relevant documents. The AI processes these materials and creates a knowledge base specific to each course.

Students can access their course chatbots using unique PINs provided by their professors. The chatbot provides instant, accurate responses to student queries by referencing only the approved course materials uploaded by the professor. This ensures that students receive consistent, reliable information while significantly reducing the number of repetitive questions professors need to address via email.

<p align="center">
    <a href="https://www.ta-chat.website/">Site Url</a>
    ·
    <a href="https://github.com/Denison-CS-349-Fall-2024/TA-Chatbot/issues">Report Bug</a>
    ·
    <a href="https://github.com/Denison-CS-349-Fall-2024/TA-Chatbot/issues">Request Feature</a>
</p>

## Table Of Contents

- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Development Setup](#development-setup)
- [Production Setup](#production-setup)
- [FAQ](#faq)
- [Contribution](#contribution)
- [License](#license)

## Tech Stack

- **Frontend**: Angular 18
- **Backend**: Django REST Framework
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Cloud Platform**: AWS
- **AI Integration**: OpenAI API
- **Vector Database**: Pinecone

## Key Features

- **Course Management**: Professors can create and manage multiple courses
- **Secure Access**: PIN-based enrollment system for students
- **AI-Powered Responses**: Contextual answers based on course materials
- **Real-time Chat**: Instant responses to student queries
- **24/7 Availability**: Round-the-clock access to course information
- **User Authentication**: Secure Google OAuth integration

## Project Structure

```
TA-Chatbot/
├── frontend/                 # Angular frontend application
│   └── src/                  # Source files for the frontend
├── webserver/                # Django backend application
│   ├── chatbot_management/   # application for chatbot logic
│   ├── class_management/     # application for class logic
│   ├── material_management/  # application for materials logic
│   ├── student_management/   # application for student enrollment logic
│   ├── user_management/      # application for user management logic
│   ├── requirements.txt      # dependencies
│   ├── webserver/            # application for webserver logic
│   └── ..
├── .env                      # environment variables
├── docker-compose.yml        # Docker compose configuration
└── README.md 
```


## Prerequisites
- [Docker](https://docs.docker.com/engine/install/)
- [Node.js 18+](https://nodejs.org/en/download/package-manager/current)
- [Python 3.11](https://www.python.org/downloads/)
- [Angular CLI](https://angular.dev/tools/cli)

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
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Django Secret Key
DJANGO_SECRET_KEY=your_django_secret_key

# Pinecone API Key
PINECONE_API_KEY=your_pinecone_api_key
```

## Development Setup

1. Setup Frontend:
```bash
cd frontend
npm install
npm start
```
Frontend will be available at `http://localhost:4200`

2. Setup Backend:
- Ensure PostgreSQL is running on your local machine (port 5432)
```bash
cd webserver
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend will be available at `http://localhost:8000`

3. Running Tests:
```bash
cd webserver
python manage.py test
```

## Production Setup

1. Ensure all [prerequisites](#prerequisites) are installed
2. Update `.env` file to use:
```env
POSTGRES_HOST=db  # Required for Docker deployment
```

3. Build and run all services:
```bash
docker compose up --build -d
```

4. Run database migrations:
```bash
# Find the webserver container ID
docker ps

# Run migrations inside the webserver container
docker exec -it <webserver-container-id> python manage.py migrate
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
## Contribution

We welcome contributions from the community! If you'd like to contribute please open a pull request. If you have any questions or requests for new features, please open an issue in our [Issues tab](https://github.com/Denison-CS-349-Fall-2024/TA-Chatbot/issues). We appreciate your input in making this tool better for everyone.

## License

TA-Chatbot is licensed under the [MIT License](LICENSE).
