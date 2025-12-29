🏠 Airbnb Clone: Full-Stack Vacation Rental Platform
A pixel-perfect, production-ready MERN stack application featuring a sophisticated booking engine, host management system, and authentic Airbnb UX.

🚀 Key Features
📅 Advanced Booking Engine
Conflict Detection: Prevents overlapping stays using backend date-range validation.

Dynamic UI Responses: Automatically triggers a "Dates Unavailable" UI upon receiving a 409 Conflict status from the server.

Total Calculation: Real-time pricing based on night count and guest selection.

🛠 Host Management (CRUD)
Multi-Image Upload: Multer-powered system supporting up to 5 photos per listing via dynamic image arrays.

Booking Management: "Boarding-pass" style ticket UI for hosts to approve or reject pending requests.

🎨 Authentic UX/UI
Airbnb Photo Grid: Custom 1+4 image gallery layout with hover effects.

Responsive Navigation: Fixed navbar with scroll-based transitions and an integrated functional search bar.

Live Maps: Interactive property location visualization using Leaflet.js.

🔒 Security & State
JWT Authentication: Secure login/signup with protected routes for hosting and booking.

Global Auth Context: Centralized state for instant UI resets upon logout.

🛠️ Tech Stack
Frontend: React, Context API, Bootstrap 5, Leaflet.js

Backend: Node.js, Express.js, Multer

Database: MongoDB with Mongoose

Icons: Bootstrap Icons
