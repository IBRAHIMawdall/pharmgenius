# How to Run PharmGenius

This project consists of two main parts that need to be run separately in a development environment:

1.  **Backend Server**: An Express.js server that provides the API.
2.  **Frontend App**: A React application that provides the user interface.

You will need two separate terminal windows to run the application.

---

### Terminal 1: Start the Backend Server

1.  Navigate to the server directory:
    ```bash
    cd d:\microservices\PharmGenius\drug-tool-lookup
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

3.  Start the server:
    ```bash
    node server.js
    ```

    You should see output indicating that the server is running on port 5000 and has loaded the drug database. Keep this terminal open.

---

### Terminal 2: Start the Frontend Application

1.  In a **new terminal**, navigate to the project's root directory:
    ```bash
    cd d:\microservices\PharmGenius
    ```

2.  Install the dependencies (if you haven't already):
    ```bash
    npm install
    ```

3.  Start the Vite development server:
    ```bash
    npm run dev
    ```

4.  Open your web browser and go to the URL provided by Vite (usually `http://localhost:5173`).

The application is now running. The React frontend will make API calls to the backend server you started in the first terminal.