# TA-Chatbot

## Project Description

TA Chatbot is a application that allows teachers to integrate their syllabus into a AI-driven chatbot to provide students an easy way ask questions about the syllabus, assignments, or course materials with quick and accurate responses.

## Contributors
 (IDK your github username so pls put in link)

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


# Prerequisites


Clone the repository:
```bash
git clone https://github.com/Denison-CS-349-Fall-2024/TA-Chatbot.git
```



Once the repository has been cloned, follow these instructions to install all necessary dependencies:

Node.js
NPM (Node Project Manager)
Angular CLI

Check if you have node and npm with the following commands:

```bash
node -v
```

```bash
npm -v
```

If you don't have them, follow the instructions at the Node.js website: https://nodejs.org/

install angular with the following command:

```bash
npm install -g @angular/cli
```


To run the Angular app,

navigate to my-angular-app directory

enter command: 

```bash
ng serve
```

use "command + enter" on the local host url to see the app

close the app with "q + enter" in the terminal


## Setting up the webserver:

Make sure you have a python 3.10+ installed. cd into the TA-Chatbot directory and run these commands:

```
python3 -m venv .
source bin/activate
pip3 install Django
```
**NOTE: each time you close your terminal, you will have to run ```source bin/activate``` from the TA-Chatbot directory.**

Once the virtual environment is setup and Django is installed, run these to start up the server:
```
cd webserver/
python3 manage.py runserver
```
The webserver will run on port 8000 on your local machine.