# Node.js Backend Setup

Follow the instructions below to set up and run the backend server.

## 🔧 Step 1: Download and Unzip

- Download this repository as a ZIP file and unzip it on your local machine.
- Navigate into the unzipped project folder. You should see an `index.js` file in the root directory.

## 📦 Step 2: Install Dependencies

Run the following command in the root folder to install all required dependencies:

```bash
npm install
```

## ⚙️ Step 3: Configure Environment Variables

- Create a `.env` file in the root directory (if it doesn’t already exist).
- Add and update the required environment variables, such as your MongoDB connection URL:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

> Modify any other environment-specific values as needed.

## 🚀 Step 4: Run the Backend Server

You can start the server in either of the following ways:

- **Basic Run:**
  ```bash
  node index.js
  ```

- **Development Mode (with nodemon):**
  ```bash
  npm run dev
  ```

> Ensure you have `nodemon` installed globally if using `npm run dev`.
