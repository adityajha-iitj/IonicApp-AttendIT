const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const upload = require('./multer'); // Multer setup for handling file uploads
const { exec } = require('child_process');
const fs = require('fs');
const bodyParser = require('body-parser');
dotenv.config();
const app = express();
var similarity = require( 'compute-cosine-similarity' );
const sharp = require('sharp');

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '100000mb' }));
app.use(bodyParser.urlencoded({ limit: '100000mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  embedding: { type: [Number] }, // Array to store embeddings
});

const User = mongoose.model('User', userSchema);

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const Admin = mongoose.model('Admin', adminSchema);


app.post('/adminRegister', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a default embedding or any other necessary default data if needed
    const embedding = []; // Use an empty array or default values if required

    // Create new admin user
    const adminUser = new User({
      fullName,
      email,
      password: hashedPassword,
      embedding,  // If embedding is necessary, add a default array or remove this field if not used
    });

    await adminUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return success response with token
    res.status(201).json({
      message: 'Admin registered successfully',
      token,
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Register Endpoint
app.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { fullName, email, password, image } = req.body.formdata;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Resize the image (optional)
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(224, 224)
      .toFormat('jpeg')
      .toBuffer();
    const resizedBase64Image = resizedImageBuffer.toString('base64');

    // Call Python script to generate embeddings
    exec(`python generate_embedings.py "${resizedBase64Image}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating embedding: ${stderr}`);
        return res.status(500).json({ message: 'Failed to generate embedding' });
      }
    
      // Clean the output from Python (remove any unexpected newlines or spaces)
      let embeddingString = stdout.trim(); // Remove leading/trailing whitespace
    
      // Check if the output is a stringified array or just a comma-separated string
      let embedding;
      try {
        // If the Python output is a valid JSON string (array format)
        embedding = JSON.parse(embeddingString);
    
        // Check if the parsed embedding is an array of numbers
        if (!Array.isArray(embedding) || embedding.some(val => isNaN(val))) {
          throw new Error('Embedding contains invalid data');
        }
      } catch (err) {
        // Handle case where the output is not a valid JSON array
        // For example, if it's a comma-separated string
        embedding = embeddingString.split(',').map(val => {
          const num = parseFloat(val.trim());
          return isNaN(num) ? null : num; // Return null for invalid numbers
        }).filter(val => val !== null); // Remove any invalid numbers (NaN)
    
        if (embedding.length === 0) {
          return res.status(400).json({ message: 'Embedding is invalid or empty' });
        }
      }
    
      // Now the embedding is a clean array of numbers
      console.log('Embedding:', embedding);  // Optional: Log to verify
    
      // Create new user with valid embeddings (as numbers)
      const user = new User({
        fullName,
        email,
        password: hashedPassword,
        embedding,  // Store the valid array of numbers
      });
    
      await user.save();
    
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Return success response with token
      res.status(201).json({
        message: 'User registered successfully',
        token,
      });
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/captureYourself', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageBuffer = req.file.buffer;
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(224, 224)
      .toFormat('jpeg')
      .toBuffer();
    const resizedBase64Image = resizedImageBuffer.toString('base64');

    exec(`python generate_embedings.py "${resizedBase64Image}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Embedding generation error: ${stderr}`);
        return res.status(500).json({ message: 'Embedding generation failed' });
      }

      let embeddingString = stdout.trim();
      let embedding;

      try {
        embedding = JSON.parse(embeddingString);
        if (!Array.isArray(embedding) || embedding.some(val => isNaN(val))) {
          throw new Error('Invalid embedding data');
        }
      } catch (err) {
        embedding = embeddingString.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
        if (embedding.length === 0) {
          return res.status(400).json({ message: 'Invalid or empty embedding' });
        }
      }
      console.log(embedding);
      

      // Retrieve the registered user's embedding for comparison (assuming it’s saved in the User model)
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const similarity = cosineSimilarity(embedding, user.embedding);
      if (similarity >= 0.8) {
        console.log('Attendance marked');
      }

      res.status(200).json({
        message: 'Embedding generated and similarity checked successfully',
        similarity,
      });
    });

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const Model = role === 'admin' ? Admin : User;

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return success response with token
    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// let similar=0
// similar=similarity(embedding1,embedding)


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
