🌿 Indoor Gardening Shop

A full-stack e-commerce web application for indoor plants, built with React, PHP, and Stripe.

🚀 Features
🛒 Shopping cart with persistent storage (localStorage)
🔐 User authentication (login & registration)
💳 Secure checkout with Stripe
💬 Product comments system
📦 Order processing via Stripe webhooks
🛡️ Security features:
CSRF protection
Rate limiting
Secure sessions (SameSite, HttpOnly, Secure cookies)
Content Security Policy (CSP via Helmet)
🏗️ Tech Stack
Frontend
React
React Router
Context API (state management)
Backend
PHP (custom API)
PostgreSQL
Stripe API
Dotenv (environment management)
Deployment
Frontend: Render
Backend: Render (Docker, Apache + PHP)
📂 Project Structure
/frontend (React app)
/api       (PHP endpoints)
/includes  (config, security, database)
/Dockerfile
⚙️ Installation (Local Development)
1. Clone repository
git clone https://github.com/your-username/indoor-gardening.git
cd indoor-gardening
2. Frontend setup
cd frontend
npm install
npm start

App runs at:
http://localhost:3000

3. Backend setup
Install PHP 8.2+
Install Composer
composer install

Create a .env file:

DB_HOST=your_db_host
DB_NAME=your_db_name
DB_USER=your_user
DB_PASSWORD=your_password
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
RESEND_API_KEY=your_email_key

Run backend via Apache / XAMPP / Docker.

🌍 Production
Frontend: https://plantfront.onrender.com
Backend API: https://plantback.onrender.com
🔐 Security Notes

This project includes:

CSRF token validation on protected routes
Rate limiting for login, register, and comments
Secure session cookies (HttpOnly, Secure, SameSite=None)
Input validation & prepared SQL statements (PDO)
CSP headers via Helmet (Node server)
📌 API Endpoints (Examples)
GET /api/get-products.php
POST /api/login.php
POST /api/register.php
POST /api/create-checkout-session.php
GET /api/comments.php
POST /api/comments.php
🧪 Future Improvements
CAPTCHA for spam protection
Admin dashboard
Order history for users
Email notifications
📄 License

This project is for educational and portfolio purposes.