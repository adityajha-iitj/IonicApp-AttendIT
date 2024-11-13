const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const upload = require('../multer');
const bodyParser = require('body-parser');
const axios = require('axios');
const sharp = require('sharp'); 
dotenv.config();
const app = express();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '100000mb' })); // Increase this limit as needed
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
  profileImage: { type: String },
  embeddings: { type: Array },
});

const User = mongoose.model('User', userSchema);

// Register Endpoint
app.post('/register', async (req, res) => {
 
  console.log(process.env.CLOUDINARY_API_KEY);
  try {
    const { fullName, email, password } = req.body.formdata;
    console.log(req.body.formdata); 

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    let profileImageUrl = null;
    let embeddings = null;
    if (req.body.formdata.image) {
      const result = await cloudinary.uploader.upload(req.body.formdata.image);
      profileImageUrl = result.secure_url; // Get the secure URL of the uploaded image
      const base64Image = req.body.formdata.image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Image, 'base64');

      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(224, 224)
        .toFormat('jpeg') // Adjust format as needed
        .toBuffer();
      const huggingFaceResponse = await axios.post(
        'https://api-inference.huggingface.co/models/facenet_20180402_114759_vggface2.pth',
        resizedImageBuffer,
        {
          headers: {
            'Content-Type': 'application/octet-stream',
            Authorization: `Bearer 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`,
          },
        }
      );

      embeddings = huggingFaceResponse.data;
      console.log(embeddings);
    }
    const user = new User({ fullName, email, password: hashedPassword , profileImage: profileImageUrl ,embeddings });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return success response with token
    res.status(201).json({
      message: 'User registered successfully',
      token,
    });
    console.log("done");
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body.formdata;

    // Check if the user exists
    const user = await User.findOne({ email });
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


// Start Server
// const PORT = process.env.PORT ||  5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;