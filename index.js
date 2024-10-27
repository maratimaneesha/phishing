require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const { exec } = require('child_process');
const hbs = require('hbs');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(
  session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
  })
);

// View engine setup
const templatePath = path.join(__dirname, '../templates');
app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(path.join(__dirname, '../src')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

// User schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', userSchema);

// Email schema and model
const emailSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  is_spam: { type: Boolean, default: false },
  is_trash: { type: Boolean, default: false }, // New field for Trash
  attachments: [
    {
      filename: String,
      path: String,
    },
  ],
});
const Email = mongoose.model('Email', emailSchema);

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register the Handlebars helper
hbs.registerHelper('eq', function (a, b) {
    return a === b;
});

// Routes
app.get('/', (req, res) => {
  res.render('homepage');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/api/user', (req, res) => {
  if (req.session.email) {
    res.json({ email: req.session.email });
  } else {
    res.status(401).json({ message: 'User not logged in' });
  }
});

app.get('/inbox/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const emails = await Email.find({ recipient: email, is_spam: false });
    res.render('inbox', { emails, email, route: 'inbox' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.get('/sent/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const emails = await Email.find({ sender: email });
    res.render('inbox', { emails, email, route: 'sent' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.get('/spam/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const spamEmails = await Email.find({ recipient: email, is_spam: true });
    
    if (spamEmails.length > 5) {
      // Move spam emails to Trash
      await Email.updateMany({ recipient: email, is_spam: true }, { is_trash: true, is_spam: false });
    }

    res.render('inbox', { emails: spamEmails, email, route: 'spam' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.get('/trash/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const emails = await Email.find({ recipient: email, is_trash: true }); // Adjusted query for trash
    res.render('inbox', { emails, email, route: 'trash' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.post('/signup', async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    return res.status(400).send('Passwords do not match');
  }
  const data = { name, email, password };
  try {
    await User.create(data);
    res.redirect('/login'); // Redirect to login page after successful signup
  } catch (error) {
    res.status(500).send('Error signing up');
    console.error('Error signing up:', error);
  }
});

// Use this function to call the Python script to predict spam
app.post('/send-email', upload.array('files'), async (req, res) => {
  const { from, to, cc, bcc, subject, body } = req.body;

  // Handle file attachments
  const attachments = req.files.map(file => ({
    filename: file.originalname,
    path: path.join(__dirname, '../uploads', file.filename),
  }));

  // Path to the Python script
  const scriptPath = path.join(__dirname, 'predict_spam.py');

  // Execute the Python script to predict if the email is spam
  exec(`python "${scriptPath}" "${subject} ${body}"`, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      console.error(`stderr: ${stderr}`); // Add stderr logging
      res.status(500).json({ message: 'Failed to send email.', error: error.message });
      return;
    }

    console.log(`stdout: ${stdout}`);  // Log stdout for debugging

    const isSpam = stdout.trim() === '1';

    try {
      // Save email to the database
      const email = new Email({
        sender: from,
        recipient: to,
        cc,
        bcc,
        subject,
        body,
        is_spam: isSpam,
        attachments: attachments,
      });
      await email.save();
      res.json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error saving email:', error.message);
      res.status(500).json({ message: 'Failed to send email.', error: error.message });
    }
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      req.session.email = user.email; // Store user email in session
      res.redirect(`/inbox/${user.email}`);
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
    console.error('Error logging in:', error);
  }
});

// Function to clear Trash folder
async function clearTrash() {
  try {
    await Email.deleteMany({ is_spam: true, is_trash: true });
    console.log('Trash folder cleared');
  } catch (error) {
    console.error('Error clearing Trash folder:', error);
  }
}

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
