*Parkitect*
Parkitect is an innovative app designed to simplify guest parking management for residential and commercial buildings. It serves tenants, managers, and guests by offering a streamlined way to reserve and manage parking spaces, enhancing the overall parking experience for all users.

Key Features
For Tenants: Tenants can book parking spaces for their guests in advance. Each tenant has a personal account to schedule and manage reservations, ensuring guests have a designated spot upon arrival.

For Managers: Building managers can control parking slot allocations, add or remove users, assign parking spaces, and monitor reservations in real time. This provides managers with a complete view of parking usage, simplifying organization and oversight.

For Guests: Guests benefit from a seamless entry process as their license plates are scanned at the parking lot entrance, where the system verifies any existing booking. If confirmed, guests gain entry and are directed to their reserved spot. Tenants receive an automatic email notification upon their guest's arrival.

Architecture Overview
This project consists of two major components:

The App: Built with a Python backend and a React Native frontend using TypeScript.

Cloud Services: Integrated services include:

Azure Function App: Stateless backend functions.
Azure SQL Database: Stores app data, including tables for bookings, users, buildings, parkings, and parking availability.
Azure Computer Vision: Used for license plate recognition.
Email Service (Google Cloud Console): Integrated with the Gmail API to send automated emails to users.
Frontend (React Native with TypeScript)
The frontend is responsible for the user interface (UI) and is developed using React Native with TypeScript for type safety. The app structure includes:

App Entry Point: App.tsx acts as the main entry point for the mobile app.

Configuration Files: The frontend folder includes environment and configuration files like app.json, tsconfig.json, and babel.config.js, managing the Expo app configuration, TypeScript setup, and Babel transpilation settings.

Screens: The screens/ folder contains the individual screens of the app, representing various parts of the user experience (e.g., booking screens, user profiles).

Backend (Python with Azure Function App)
The backend is stateless and deployed using Azure Function App to handle HTTP requests from the frontend. Key backend components include:

function_app.py: The main entry point for the serverless backend. This file defines the API endpoints to handle HTTP requests from the app, providing a clear interface between frontend and backend.

helpers.py: Contains utility functions to assist backend processes, including data formatting and validation.

booking_management.py: Manages all booking-related logic, such as creating, updating, or deleting booking records, interacting with the SQL database for data related to bookings and other associated records.

Email Integration: Automated emails are sent via the Gmail API (Google Cloud Console) to notify tenants when guests arrive. Integrated into backend functions, the email service keeps tenants informed in real-time of guest arrivals.

Database Integration: The backend interacts with the Azure SQL Database, storing data across five tables:

bookings: Booking information.
users: User data.
buildings: Building information.
parkings: Parking spot data.
parking_availability: Parking spot availability.
The db/ folder contains configuration files and data manipulation scripts for interacting with these SQL tables. Backend functions use these scripts to fetch, update, or delete data as required.

Cloud Services
Azure SQL Database: Stores core data across tables for users, bookings, and parking spot availability, providing persistent data storage.

Azure Function App: Stateless functions respond to HTTP requests from the frontend, with each function designed for quick, on-demand execution triggered by app interactions.

Azure Computer Vision: Enables license plate recognition for verifying vehicles and managing parking availability based on plate numbers.

Google Cloud Email Service: Uses the Gmail API to send automated emails (e.g., guest arrival notifications), authenticated through Google Cloud Console and triggered by backend functions.

Flow of Operations
User Interaction: A user interacts with the app UI, performing actions like booking a parking spot.

API Call to Backend: User actions trigger HTTP requests to API endpoints defined in function_app.py.

Function Execution: The backend processes requests via functions, such as creating or updating bookings through booking_management.py.

Database Interaction: The function interacts with the SQL database to retrieve or modify data as needed.

Response to Frontend: After processing, results (e.g., booking details) are sent back to the frontend, updating the UI based on the action.

