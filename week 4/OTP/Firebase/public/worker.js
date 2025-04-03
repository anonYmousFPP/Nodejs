importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAseO6rnehGACwzHGAME-qSZ6UKOJXZxqg",
    authDomain: "fir-95f75.firebaseapp.com",
    projectId: "fir-95f75",
    storageBucket: "fir-95f75.firebasestorage.app",
    messagingSenderId: "730631908850",
    appId: "1:730631908850:web:387ccd6ff94d917c130f6b",
    measurementId: "G-XPJGHVY399"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Background message:', payload);
    self.registration.showNotification(
        payload.notification.title,
        { body: payload.notification.body }
    );
});