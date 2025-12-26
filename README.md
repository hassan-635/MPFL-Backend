# 🚀 MPFL - Multi-Platform Freelancer Link (Backend)

**MPFL** is a professional proof-delivery and feedback management system designed to bridge the communication gap between freelancers and clients. It provides a secure environment for freelancers to deliver creative assets (Images/GIFs/Videos) and receive structured, real-time feedback.

---

## ✨ Core Features (Current Phase)

### 🔐 Authentication & Security

- **JWT-Based Auth:** Secure user sessions using JSON Web Tokens and HTTP-only cookies.
- **Role Protection:** Strict access control ensuring only project owners can manage assets.
- **Bcrypt Hashing:** Industry-standard encryption for user credentials.

### 📁 Project & Asset Management

- **Cloudinary Integration:** Automated high-speed media uploads and storage.
- **Shareable Access Tokens:** Secure, non-login public links for clients to review work.
- **Real-time Dashboard:** Instant statistics for Total, Pending, and Completed projects.

### 💬 Client Interaction System

- **Granular Feedback:** Clients can provide specific comments and decisions (Accept/Reject) on individual files.
- **Bulk Project Approval:** Streamlined workflow allowing clients to approve entire batches in one click.
- **Auto-Status Sync:** Projects automatically transition to "Completed" status upon client approval.

### 📧 Automated Notifications

- **Delivery Alerts:** Instant email notifications to clients when new proofs are uploaded.
- **Feedback Loops:** Real-time email alerts to freelancers when a client provides feedback.

---

## 🛠️ Tech Stack

- **Backend:** Node.js & Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Media Storage:** Cloudinary
- **Communication:** Nodemailer (SMTP)
- **Environment:** Dotenv for secure configuration

---

## 🔮 Future Roadmap (Scaling Goals)

We aim to evolve MPFL into a full-scale freelancer management suite. Upcoming features include:

1.  **🎥 Interactive Video Proofing:** Frame-by-frame commenting allowing clients to timestamp feedback directly on videos.
2.  **💳 Escrow Payment Integration:** Integration with Stripe/PayPal to hold and release payments automatically upon project approval.
3.  **📂 Version Control System:** A historical log of all revisions, allowing users to compare current work with previous versions.
4.  **💬 Real-time Collaboration:** An in-app chat system to minimize dependency on external messaging platforms.
5.  **📊 Freelancer Analytics:** Advanced data visualization for monthly revenue, client satisfaction, and delivery efficiency.
6.  **🤖 AI-Powered Summaries:** Using AI to summarize long client feedback threads into actionable tasks.

---

## 🚀 Installation & Setup

### 1. Clone the Project

```bash
git clone https://github.com/hassan-635/MPFL-Backend.git
cd backend-mpfl
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

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Run the Client

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Developed with ❤️ by Hassan Ali Abrar
