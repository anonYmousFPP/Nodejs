const express = require('express');
const admin = require('firebase-admin');
const app = express();

const serviceAccount = require('/home/user/Desktop/Coding/week 4/OTP/Firebase/notification.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());

let deviceToken = '';

app.post('/register-token', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token required' });
    deviceToken = token;
    res.json({ success: true, message: 'Token registered' });
});

app.post('/send-notification', async (req, res) => {
    if (!deviceToken) return res.status(400).json({ error: 'No token registered' });

    const message = {
        notification: {
            title: 'Welcome to MyApp',
            body: 'Thank you for signing up! Stay tuned for updates and alerts.'
        },
        token: deviceToken
    };

    try {
        const response = await admin.messaging().send(message);
        res.json({ success: true, message: 'Notification sent', response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));