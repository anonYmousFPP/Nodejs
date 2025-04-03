
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDRS7xo26vo4HCxX9sIDFG7XU7yPhILZB8",
  authDomain: "push-notification-demo-c342e.firebaseapp.com",
  projectId: "push-notification-demo-c342e",
  storageBucket: "push-notification-demo-c342e.firebasestorage.app",
  messagingSenderId: "142506290613",
  appId: "1:142506290613:web:666c8535e776d8503efdfc",
  measurementId: "G-Z8CWEQRRT5"
};

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message", payload);
    const notificationTitle = payload.notification?.title || "Background Message";
    const notificationOptions = {
        body: payload.notification?.body || "Background Message body.",
        icon: "/firebase-logo.png"
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});