# Kondapur Bazaar - MERN E-Commerce

Full-stack e-commerce app: React (Vite), Node/Express, MongoDB, JWT auth.

## Features
- Register / Login (bcrypt + JWT), roles: user and admin
- Products: search, category filter, pagination, product details
- Cart (saved in browser), checkout, cash on delivery
- Server calculates prices and reduces stock (browser cannot change price)
- My orders page
- Admin dashboard: add / edit / delete products, view all orders, change order status, revenue stats

## Run locally
Backend:
    cd backend
    npm install
    copy .env.example to .env and fill MONGO_URI and JWT_SECRET
    npm run seed      (adds sample products + admin: admin@shop.com / admin123)
    npm run dev

Frontend (new terminal):
    cd frontend
    npm install
    copy .env.example to .env
    npm run dev

## Deploy
- Database: MongoDB Atlas
- Backend: Render (root directory: backend, build: npm install, start: npm start, add env vars MONGO_URI and JWT_SECRET)
- Frontend: Vercel (root directory: frontend, env var VITE_API_URL = https://your-render-url/api)
