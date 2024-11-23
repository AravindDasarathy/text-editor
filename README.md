# Collaborative Text Editor Application

This is a real-time collaborative text editor built with React, Node.js, Express, Socket.IO, and Material UI. The application allows multiple users to edit documents simultaneously, invite collaborators, and manage documents with a user-friendly interface.

This is a full-stack application with separate frontend and backend directories. The frontend is built with React and Material UI, while the backend uses Node.js, Express.js and MongoDB.

## Prerequisites
Ensure the following are installed on your system:

* Node.js (v16 or higher)
* npm (comes with Node.js)
* MongoDB (local or hosted, e.g., MongoDB Atlas)

## Docker Installation
Create your .env file based on the .env file in backend and execute:
```console
docker-compose up --build
```

## Manual Installation
Clone the repository and navigate to the respective directories for frontend and backend setup.
```console
git clone https://github.com/AravindDasarathy/text-editor.git
cd text-editor
```
#### Frontend Setup
Navigate to the frontend directory and install dependencies
```console
cd frontend
npm install
```
#### Backend Setup
Navigate to the backend directory and install dependencies
```console
cd ../backend
npm install
```
#### Environment Setup
A skeleton .env file is present in the repo. Use that to fill your respective environment variables.

## Running the Application
#### Start Backend
1. Ensure your MongoDB service is running.
2. Navigate to the backend directory, start the backend server: `npm start`.
The backend server runs on the port 3001.

#### Start Frontend
1. Navigate to the frontend directory, start the frontend development server: `npm start`.
The frontend will run on the port 3000.