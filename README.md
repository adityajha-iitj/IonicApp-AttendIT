# Photo-Based Attendance System

The Photo-Based Attendance System is an innovative solution designed to modernize attendance management through facial recognition technology. This system integrates the FaceNet model for generating facial embeddings and utilizes MongoDB for secure data storage. The implementation encompasses both client-side and server-side components, providing comprehensive functionality for user management and attendance tracking.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Ionic CLI
- Capacitor CLI

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd IonicApp-test
    ```

2. Install dependencies for the client:
    ```sh
    cd client
    npm install
    ```

3. Install dependencies for the server:
    ```sh
    cd ../server
    npm install
    ```

### Running the Application

#### Client

1. Start the Ionic development server:
    ```sh
    cd client
    npm start
    ```

2. Open the application in your browser at `http://localhost:8100`.

#### Server

1. Start the server:
    ```sh
    cd server
    node server.js
    ```

2. The server will be running at `http://localhost:3000`.

### Building the Application

To build the client application for production, run:
```sh
cd client
ionic serve
npm run dev
