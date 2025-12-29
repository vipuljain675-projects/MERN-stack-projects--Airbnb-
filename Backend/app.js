const path = require('path');
const fs = require('fs'); // 🟢 ADDED THIS
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const storeRouter = require('./routes/storeRouter');
const hostRouter = require('./routes/hostRouter');
const authRouter = require('./routes/authRouter');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/airbnb_react';

const app = express();

/* ==========================================
   1. DIRECTORY SAFETY (FIXES ENOENT ERROR)
   ========================================== */
// This ensures the 'uploads' folder exists so Multer doesn't crash
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
    console.log("📁 Created missing 'uploads' directory");
}

// 2. Enable CORS
app.use(cors());

// 3. Body Parsers
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

// 4. Static Assets
app.use(express.static(path.join(__dirname, 'public')));
// Serving the uploads folder so frontend can see the images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. API Route Mounting
app.use('/api', authRouter);  
app.use('/api', storeRouter); 
app.use('/api/host', hostRouter);

// 6. Global Error Handling
app.use((req, res, next) => {
  res.status(404).json({ 
    message: 'Endpoint Not Found',
    path: req.originalUrl 
  });
});

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  res.status(status).json({ message: message });
});

/* ==========================================
   7. DATABASE & SERVER START
   ========================================== */
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // Port 3500 matches your frontend api.js configuration
    app.listen(3500, () => {
      console.log('🔥 API Server running at http://localhost:3500');
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });