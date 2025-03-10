# LoveSocketAPI

LoveSocketAPI is a real-time messaging API built using **Node.js**, **Express.js**, **MongoDB**, and **Socket.io**. It provides a secure and scalable backend for real-time chat applications with user authentication, message storage, and notification support.

## Features
- **User Authentication**: Secure login and registration with password hashing.
- **Real-time Messaging**: Instant message delivery using Socket.io.
- **MongoDB Storage**: Persistent storage for messages and user data.
- **Notifications**: Event-based notifications for new messages.
- **RESTful API**: Endpoints for managing users, messages, and chat rooms.

## Technologies Used
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Socket.io** - Real-time bidirectional event-based communication
- **JWT (JSON Web Token)** - User authentication
- **dotenv** - Environment variable management
- **bcrypt.js** - Secure password hashing

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/LoveSocketAPI.git
   cd LoveSocketAPI
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure the environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```sh
   npm start
   ```
   The server will run on `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and return token

### Users
- `GET /api/users/user/:id` - Get user by ID
- `GET /api/users/update/:id` - Update user information

### Messages
- `POST /api/messages` - Send a new message
- `GET /api/messages/update` - Edit sent messages from a chat

## WebSocket Events
- `connect` - Establish a connection
- `disconnect` - Handle user disconnection
- `message` - Send and receive messages in real-time

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.
