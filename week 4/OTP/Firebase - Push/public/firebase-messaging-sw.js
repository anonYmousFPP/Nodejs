  self.addEventListener('error', (event) => {
    console.error('Service Worker Error:', event);
  });
  
  try {
    self.importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js');
    self.importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging.js');
  
    const firebaseConfig = {
        apiKey: "AIzaSyDRS7xo26vo4HCxX9sIDFG7XU7yPhILZB8",
        authDomain: "push-notification-demo-c342e.firebaseapp.com",
        projectId: "push-notification-demo-c342e",
        storageBucket: "push-notification-demo-c342e.firebasestorage.app",
        messagingSenderId: "142506290613",
        appId: "1:142506290613:web:666c8535e776d8503efdfc",
        measurementId: "G-Z8CWEQRRT5"
    };
  
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
  
    messaging.onBackgroundMessage(function(payload) {
      console.log('[firebase-messaging-sw.js] Received background message:', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
      };
      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } catch (error) {
    console.error('Error in service worker:', error);
  }