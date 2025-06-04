# 🌐 CampusHive

CampusHive is a platform designed to solve common campus challenges by enhancing communication and connecting students for collaboration, carpooling, social interactions, and more.

## 🚀 Features

- Real-time public chat and private DMs using Socket.IO  
- Secure login with JWT and Google OAuth  
- Carpool posts to reduce travel costs  
- Lost & Found with searchable listings  
- Project posts to connect for collaborations  
- Peer-to-peer car rental listings  

## 🏗️ Tech Stack

React.js, Node.js, Express.js, MongoDB, CSS3, Socket.IO, JWT, Google OAuth

## 🛠️ Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Geeteshgit/.git
   cd campushive

2. **Backend Setup**
   ```bash
   cd backend
   npm install

3. **Set up environment variables**
   Create a .env file in the backend folder with the following:
   ```bash
   PORT = port_number
   MONGO_URI = your_mongodb_connection_string
   JWT_SECRET = your_jwt_secret
   JWT_EXPIRES_IN = jwt_expires_in
   CLIENT_URL=frontend_url
   GOOGLE_CLIENT_ID=your_google_client_id

4. **Run the backend server**
   ```bash
   node server.js

5. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install

3. **Set up environment variables**
   Create a .env file in the frontend folder with the following:
   ```bash
   VITE_API_URL=backend_url
   VITE_GOOGLE_CLIENT_ID=your_google_client_id

4. **Run the frontend server**
   ```bash
   npm run dev

## Contact

Created by Geetesh Dalal – feel free to reach out!