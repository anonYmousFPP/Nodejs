const express = require('express');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
app.use(express.json());

// Initialize Firebase Admin SDK with service account
const serviceAccount = require('./serviceAccountKey.json'); // Place the downloaded JSON here
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Serve the frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API to send notification
app.post('/send-notification', (req, res) => {
  const { token } = req.body; // FCM token from the frontend

  if (!token) {
    return res.status(400).send('Token is required');
  }

  const message = {
    notification: {
      title: 'Welcome to MyWebApp', // Replace with your app name
      body: 'Thank you for signing up! Stay tuned for updates and alerts.',
    },
    token: token, // Device token to send the notification to
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
      res.status(200).send('Notification sent successfully');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      res.status(500).send('Error sending notification');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});