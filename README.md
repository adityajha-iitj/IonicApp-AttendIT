# Photo-Based Attendance System

The Photo-Based Attendance System is an innovative solution designed to modernize attendance management through facial recognition technology. This system integrates the FaceNet model for generating facial embeddings and utilizes MongoDB for secure data storage. The implementation encompasses both client-side and server-side components, providing comprehensive functionality for user management and attendance tracking.

This is an Ionic framework based application which is used to capture attendance of students through face recognition. Students first register themselves by providing their details and uploading their photo, then the respective course instructor shows the qr code in the class, which the student scans, then scans his face, then attendance of the respective course gets updated. There are two sets of interfaces for two types of user, Faculty and Students, Students follow the same flow of marking the attendance as mentioned, and faculties after loggin in get to see options to add their respective courses, generate or show qr code of the respective course (which will be random everytime generated), and download the csv file of all the students details whose attendance have been marked successfully of the respective course.

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
