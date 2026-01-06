# 🚚 Cargo Tracker – Truck Fleet Management App

A complete **React Native + Expo** mobile application for managing truck fleets with **real-time trip management**, **fuel tracking**, and **live location monitoring**.
Built using **Firebase (Authentication + Firestore)** with a scalable, production-ready architecture.

---

## ✨ Features

- **User Authentication** – Secure login & logout using Firebase Auth
- **Manager Dashboard** – Overview of trucks, active trips, drivers, and pending loads
- **Trip Management** – Create, track, and update trips with timestamps
- **Fuel Tracking** – Log fuel refills during trips
- **Unload Entry** – Mark trips completed with arrival time
- **Recent Trips Feed** – Activity-style recent trip updates
- **Live Location (Optional)** – Real-time truck tracking using Firebase + device GPS
- **Responsive UI** – Clean and modern mobile-first design
- **Cross Platform** – Android & iOS using Expo

---

## 🛠 Tech Stack

### Frontend

- **React Native**
- **Expo**
- **TypeScript**
- **React Navigation**
- **NativeWind / Custom Styles**

### Backend

- **Firebase Authentication**
- **Firebase Firestore**
- **Firebase Realtime / Cloud Functions (optional)**

### Utilities

- Expo Location (for GPS)
- Firebase SDK
- Secure environment variables

---

## 📦 Prerequisites

- Node.js (v16+)
- npm or yarn
- Firebase account (free tier)
- Expo Go app (for testing)

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/cargo-tracker.git
cd cargo-tracker
```

### 2️⃣ Install Dependencies

```bash
npm install
```

If needed:

```bash
npm install --force
```

---

## 🔥 Firebase Setup

### 3️⃣ Create Firebase Project

1. Go to 👉 [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication**

   - Sign-in method: **Email / Password**

4. Enable **Firestore Database**

---

### 4️⃣ Firebase Configuration

Create `firebaseConfig.ts`:

```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
```

⚠️ **Do NOT commit this file** (already covered in `.gitignore`)

---

## 🧱 Firestore Data Structure

### 🔹 trucks (collection)

```json
{
  "truckNo": "TRK-101",
  "bidNo": "BID-001",
  "createdAt": "timestamp"
}
```

---

### 🔹 trips (collection)

```json
{
  "truckNo": "TRK-101",
  "bidNo": "BID-001",
  "quantity": 25,
  "departureTime": "timestamp",
  "arrivalTime": "timestamp | null",
  "fuelFilled": 120,
  "status": "ongoing | completed",
  "createdAt": "timestamp"
}
```

---

### 🔹 liveLocations (optional – collection)

```json
{
  "truckNo": "TRK-101",
  "latitude": 28.6139,
  "longitude": 77.209,
  "updatedAt": "timestamp"
}
```

---

## ▶️ Running the App

### Start Expo Server

```bash
npm start
```

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

Or simply scan the QR code using **Expo Go** 📱

---

## 📂 Project Structure

```
CargoTracker/
├── App.tsx
├── firebaseConfig.ts        # Firebase setup (ignored in git)
├── screens/
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── AddTripScreen.tsx
│   ├── TripsListScreen.tsx
│   └── LiveMapScreen.tsx
├── utils/
├── assets/
├── package.json
├── tsconfig.json
├── app.json
└── README.md
```

---

## 🔐 Authentication Flow

1. User logs in using Email & Password
2. Firebase Auth manages session
3. `auth.currentUser` used for protected routes
4. Logout clears session instantly

---

## 📍 Live Location Tracking (Optional)

- Use `expo-location` to get GPS
- Update Firestore every 10–30 seconds
- Subscribe using `onSnapshot()` for real-time updates

```ts
onSnapshot(collection(db, "liveLocations"), (snapshot) => {
  snapshot.docs.forEach((doc) => console.log(doc.data()));
});
```

---

## 🧪 Common Issues & Fixes

### App crashes on start

```bash
expo start -c
```

### Firebase auth not working

- Check Email/Password enabled
- Verify Firebase config values
- Restart Metro bundler

### Firestore permission error

For testing:

```js
allow read, write: if true;
```

(Use proper rules in production)

---

## 🔒 Security Best Practices

- Never commit Firebase keys
- Use Firestore Rules
- Validate all inputs
- Restrict write access per user
- Enable App Check (optional)

---

## 🚀 Future Enhancements

- Driver vs Manager roles
- Push notifications (Firebase Cloud Messaging)
- Offline sync
- Trip analytics dashboard
- PDF / Excel export
- Fuel cost calculations
- Background location tracking

---

## 📜 License

MIT License – Free to use and modify

---

## 🤝 Support

If you face issues:

1. Check Metro logs
2. Verify Firebase setup
3. Clear Expo cache
4. Test Firestore rules
