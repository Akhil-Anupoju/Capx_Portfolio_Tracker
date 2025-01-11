# Simple Portfolio Tracker

## Overview
The **Simple Portfolio Tracker** is a powerful web application designed to help users efficiently manage their stock holdings. Built with a modern tech stack, this application allows users to add, view, edit, and delete stock holdings while tracking the total portfolio value based on real-time stock prices. The intuitive dashboard displays key portfolio metrics, including total value, top-performing stock, and portfolio distribution.

## Features
- **User-Friendly Interface**: A responsive web application built with React, ensuring a seamless user experience across devices.
- **Portfolio Management**:
  - Add, edit, and delete stock holdings.
  - View current stock holdings in a clear list/table format.
- **Real-Time Tracking**: Integrates with free stock price APIs to dynamically calculate and display the total portfolio value.
- **Dashboard Metrics**: Displays essential metrics such as total portfolio value, top-performing stock, and portfolio distribution.

## Tech Stack
- **Frontend**: React (or any modern frontend framework)
- **Backend**: Node.js
- **Database**: MySQL (or any relational database)
- **APIs**: RESTful APIs for backend operations
- **Real-Time Data**: Integration with free stock price APIs (e.g., Alpha Vantage, Yahoo Finance, Finnhub)

## Backend Functionality
- **RESTful APIs**:
  - Add a new stock
  - Update existing stock details
  - Delete a stock
  - Fetch all stocks and calculate the total portfolio value
- **Database Interaction**: Utilizes JPA and Hibernate for effective database management.
- **Error Handling**: Properly handles exceptions with meaningful HTTP status codes.

## Database Schema
The database schema is designed to store essential stock details, including:
- Stock Name
- Ticker
- Quantity
- Buy Price
- User and Portfolio relations (if applicable)

## Deployment
- **Backend**: Deployed on platforms like Heroku, AWS, or Render.
- **Frontend**: Deployed on platforms like Vercel or Netlify.

## Getting Started
To run the application locally, follow these steps:
1. Clone the repository.
2. Set up the database and configure application properties.
3. Run the backend server and frontend application.
4. Access the application through your web browser.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Live Demo
[Link to Deployed Application](https://lambent-haupia-0b550b.netlify.app/) 
