require('dotenv').config(); // 🟢 RECTIFIED: This must be the first line
const path = require('path');
const fs = require('fs'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const storeRouter = require('./routes/storeRouter');
const hostRouter = require('./routes/hostRouter');
const authRouter = require('./routes/authRouter');

// 🟢 RECTIFIED: Use variable from .env
const MONGODB_URI = process.env.MONGODB_URI; 

const app = express();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', authRouter);  
app.use('/api', storeRouter); 
app.use('/api/host', hostRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint Not Found', path: req.originalUrl });
});

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  res.status(status).json({ message: message });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // 🟢 RECTIFIED: Use process.env.PORT for deployment
    const port = process.env.PORT || 3500;
    app.listen(port, () => {
      console.log(`🔥 API Server live on Atlas & running at port ${port}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });