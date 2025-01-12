# JobScout

**JobScout** is a fullstack web application designed to help users explore job opportunities from multiple sources. It provides an intuitive platform to view, search, and filter job postings, with features like authentication, admin functionalities, and real-time data scraping. The key feature is the **Cover Letter Generation using GPT-3.5 Turbo** to boost your experience in job hunting.

## 🚀 Features

- **Job Search**: Scrapes and displays job postings from 6 different sources.
- **Authentication**: User authentication for secure access.
- **Real-Time Data Scraping**: Automatically updates job postings.
- **Responsive Design**: Works seamlessly across desktop and mobile.
- **Dockerized Setup**: Easy deployment using Docker and `docker-compose`.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT, Bcrypt
- **Web Scraping**: Puppeteer
- **Testing**: Jest, Swagger
- **Deployment**: Docker, Render (for cloud hosting), Vercel

## 🌍 Live Demo

You can try the live version of JobScout here:

- [Frontend](https://jobscout.viettran.fi)
- [Backend](https://jobscout-api-f8ep.onrender.com)

## 📦 Getting Started

Follow the steps below to get the project running locally:

### Prerequisites

- Node.js (v18 or later)
- MongoDB (use MongoDB Atlas for remote DB or run a local instance)
- Docker (for containerized setup)

### Step 1: Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/Viettranni/JobScout.git
cd jobscout
````

### Step 2: Setup MongoDB Atlas
Get your link from https://www.mongodb.com/cloud/atlas/register and include it in your backend environment file.

Basically you Backend .env file would need the following:
MONGODB_URI,
JWT_SECRET,
OPENAI_API_KEY,
PORT

And the Frontend: 
VITE_API_URL="https://jobscout-api-f8ep.onrender.com"

### Step 3: Install Docker and run the the following commad

```bash
docker-compose up
````

Now you should have a working JobScout application. 

# 🚧 Deployment
### Deploying Backend
The backend is deployed on Render. You can configure the backend on your cloud provider (like Render or Heroku) using the same docker-compose.yml setup. Update environment variables accordingly.

### Deploying Frontend
The frontend is deployed on Viet's Vercel. You can build and deploy it to any platform that supports static site hosting, such as Render, Netlify, or Vercel.

# 🔐 CORS Configuration
To avoid CORS issues between the frontend and backend, make sure your backend's CORS configuration includes the frontend URL (both local and production):

```bash 
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local frontend
      "https://jobscout-frontend.onrender.com", // Deployed frontend
      "exp://192.168.0.108:8081", // Expo mobile app
      "http://localhost:5002", // For Docker
    ],
    credentials: true,
  })
);
````

# 📝 Notes
- MongoDB Atlas is recommended for production to avoid managing your own MongoDB instance.
- You can modify the scraping logic in the backend to add additional job sources.
- Make sure your API is secured in production by using environment variables and secret keys.