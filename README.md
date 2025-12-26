# 🚀 MPFL - Multi-Platform Freelancer Link (Backend)

**MPFL** ek professional proof-delivery aur feedback management system hai jo freelancers aur clients ke darmiyan communication gap ko khatam karta hai. Ye platform freelancers ko ijazat deta hai ke wo apna kaam (Images/GIFs/Videos) professionally deliver karein aur clients se real-time feedback hasil karein.

---

## ✨ Key Features (Implemented)

### 🔐 Authentication & Security

- **JWT Authentication:** Secure login aur signup system via Cookies.
- **Protected Routes:** Sirf authorized freelancers hi projects create aur manage kar sakte hain.
- **Secure Password Hashing:** Bcrypt ka istemal passwords ko safe rakhne ke liye.

### 📁 Project & Proof Management

- **Smart Uploads:** Cloudinary integration ke zariye images aur GIFs ka automatic storage.
- **Shareable Tokens:** Client ke liye unique, secure, aur bina-login wala access link.
- **Dashboard Stats:** Real-time summary (Total, Pending, Completed, Awaiting Feedback).

### 💬 Client Interaction & Feedback

- **Single File Feedback:** Client har file par alag se comment aur decision (Accept/Reject) de sakta hai.
- **Bulk Approval:** Aik click mein poora project approve karne ki facility.
- **Auto-Status Sync:** Bulk approval par project status khud-ba-khud `completed` ho jata hai.

### 📧 Automated Notifications (Nodemailer)

- **Delivery Alerts:** Jab freelancer kaam upload karta hai, client ko foran email chali jati hai.
- **Feedback Notifications:** Client ke response par freelancer ko instant email update milta hai.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Cloud Storage:** Cloudinary
- **Mailing Service:** Nodemailer (Gmail SMTP)
- **Security:** JWT, Bcrypt, CORS

---

## 🔮 Future Implementations (Roadmap)

Project requirements ke mutabiq, hum ye features aglay phase mein add karenge:

1.  **Video Proofing:** Direct video timestamping (Client video ke specific second par comment kar sakay ga).
2.  **Version Control:** Purani files ka record aur naye versions ki tracking.
3.  **Chat Integration:** Freelancer aur Client ke darmiyan real-time chat box.
4.  **Payment Gateway:** Project approve hote hi Stripe ya PayPal ke zariye payment release.
5.  **Multi-User Roles:** Teams ke liye sub-accounts aur permissions ka system.
6.  **Push Notifications:** Browser aur mobile par instant notification alerts.

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone the repo
git clone [your-repo-url]

# Install dependencies
npm install

```

### 2. Setup Environment Variables

```bash
# Create a .env file in the root directory
# Add the following variables
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
USER_EMAIL=your_gmail_id
EMAIL_PASS=your_gmail_app_password
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_key
API_SECRET=your_cloudinary_secret

```

### 3. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start

```

### Developed with ❤️ by Hassan Ali Abrar
