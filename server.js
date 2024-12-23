const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const authenticateToken = require('./middleware/auth');
const express = require('express');

dotenv.config();
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mydatabase';

// Middleware to parse JSON bodies
app.use(express.json());

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);


// Define a Schema and Model
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
  });
  
  const Item = mongoose.model('Item', itemSchema);
  
  // API Endpoints
  app.get('/api/items', authenticateToken, async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  });
  
  app.post('/api/items', authenticateToken, async (req, res) => {
    try {
      const newItem = new Item(req.body);
      const savedItem = await newItem.save();
      res.json(savedItem);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add item' });
    }
  });


// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`API is running at http://0.0.0.0:${port}`);
  });
