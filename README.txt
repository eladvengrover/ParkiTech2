# Parkitect: IoT-Based Guest Parking Management Solution

Parkitect is a comprehensive IoT solution designed to simplify guest parking management in residential and commercial buildings. By offering features for tenant reservations, guest access control, and real-time management tools for building administrators, Parkitect helps create a seamless parking experience. 

For in-depth details on features, architecture, and use cases, please refer to the accompanying project document - "Workshop on IoT - Parkitect.pdf".

### Setup and Installation

1. **Clone the Repository:**  
   git clone https://github.com/your-username/ParkiTech2.git
   cd Parkitect

2. **Install Dependencies:**  
   Ensure Node.js (https://nodejs.org/) and Python (https://www.python.org/) are installed.
   
   - For the frontend:
     cd frontend
     npm install

   - For the backend:
     cd backend
     pip install -r requirements.txt

3. **Configure Environment Variables:**
   - Set up Azure Function App settings for backend operations.
   - Configure Google Cloud credentials for email notifications.
   - Add Azure Computer Vision API credentials for license plate recognition.

4. **Run the Application:**
   - **Frontend:** Start the React Native app.
     npm start
   - **Backend:** Deploy to Azure or run locally using Azure Functions.
