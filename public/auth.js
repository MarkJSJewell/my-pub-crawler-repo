// public/auth.js

const firebaseConfig = {
    // ✅ FIXED: Updated to match your actual Firebase Console Key
    apiKey: "AIzaSyDllyjsS-uJ5ldC95xo8QQuyu9eNwm5i8U",
    
    authDomain: "pub-crawler-backend.firebaseapp.com",
    projectId: "pub-crawler-backend",
    storageBucket: "pub-crawler-backend.firebasestorage.app",
    messagingSenderId: "366467560298",
    appId: "1:366467560298:web:390fda941dabefe1d3eb13"
};

// 1. Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    
    // Initialize App Check if available
    if (firebase.appCheck) {
        const appCheck = firebase.appCheck();
        // This token is public and safe to be here for App Check
        appCheck.activate('6Ld_OCgsAAAAAAgEbt4nOW6wuO0cJKI9bEo80fae', true);
        console.log('Firebase App Check initialized');
    }
} catch (e) {
    console.error('Firebase Initialization Error:', e);
}

// 2. Global Login/Logout Functions
window.loginWithGoogle = function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            console.log("Logged in:", result.user.email);
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error("Login Error:", error);
            alert("Login failed: " + error.message);
        });
};

// ✅ Global SignOut function (Used by all pages)
window.signOut = function() {
    firebase.auth().signOut().then(() => {
        console.log("User signed out.");
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error("Sign Out Error:", error);
    });
};

// 3. Auth State Observer (The "Gatekeeper")
firebase.auth().onAuthStateChanged((user) => {
    const path = window.location.pathname;
    const isLoginPage = path.includes('login.html');

    if (user) {
        // ✅ USER IS LOGGED IN
        if (isLoginPage) {
            window.location.href = 'index.html';
            return;
        }

        // Update UI logic (For both index.html and index_geoapify.html)
        const nameDisplay = document.getElementById('user-name');
        if (nameDisplay) nameDisplay.innerText = user.email.split('@')[0];

        const profileDiv = document.getElementById('user-profile');
        if (profileDiv) profileDiv.style.display = 'flex'; // Ensure flex layout

        const contentDiv = document.getElementById('main-content');
        if (contentDiv) contentDiv.style.display = 'flex'; // Ensure flex layout

    } else {
        // ❌ USER IS LOGGED OUT
        if (!isLoginPage) {
            console.log("Unauthorized access. Redirecting to login...");
            window.location.href = 'login.html';
        }
    }
});
