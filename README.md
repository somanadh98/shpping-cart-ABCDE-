# Shopping Cart System

A simple shopping cart system built with Go backend and React frontend.

## Tech Stack

**Backend:**
- Go
- Gin web framework
- GORM for database
- PostgreSQL database
- Simple token-based authentication

**Frontend:**
- React
- fetch API for HTTP requests

## PostgreSQL Setup

1. Install PostgreSQL on your system if not already installed.

2. Create a database:
   ```
   createdb shopping_cart
   ```
   Or using psql:
   ```
   psql -U postgres
   CREATE DATABASE shopping_cart;
   ```

3. Create a `.env` file in the `backend` directory (copy from `.env.example`):
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_NAME=shopping_cart
   ```

4. Update the values in `.env` with your PostgreSQL credentials.

## How to Run Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Set environment variables. On Windows PowerShell:
   ```
   $env:DB_HOST="localhost"
   $env:DB_PORT="5432"
   $env:DB_USER="postgres"
   $env:DB_PASSWORD="your_password"
   $env:DB_NAME="shopping_cart"
   ```
   
   On Linux/Mac:
   ```
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_USER=postgres
   export DB_PASSWORD=your_password
   export DB_NAME=shopping_cart
   ```

   Or load from `.env` file using a tool like `godotenv` if you prefer.

3. Install dependencies:
   ```
   go mod download
   ```

4. Run the server:
   ```
   go run main.go
   ```

The backend will start on `http://localhost:8082`

## How to Run Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Create a `.env` file (copy from `.env.example`):
   ```
   REACT_APP_API_URL=http://localhost:8082
   ```
   For local development, set this to your backend URL.

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

The frontend will start on `http://localhost:3000`

## Production Deployment

### Vercel (Frontend)

1. Set the environment variable in Vercel dashboard:
   - `REACT_APP_API_URL` = Your Render backend URL (e.g., `https://your-app.onrender.com`)

2. Deploy your frontend to Vercel.

### Render (Backend)

1. Set environment variables in Render dashboard:
   - `DB_HOST` = Your PostgreSQL host
   - `DB_PORT` = 5432 (or your port)
   - `DB_USER` = Your PostgreSQL user
   - `DB_PASSWORD` = Your PostgreSQL password
   - `DB_NAME` = Your database name

2. Deploy your backend to Render.

3. The backend CORS is configured to allow:
   - `http://localhost:3000` (local development)
   - `https://*.vercel.app` (Vercel deployments)

## API Flow

1. **User Signup**: POST `/users` - Create a new user account
2. **Login**: POST `/users/login` - Login and get a token
3. **View Items**: GET `/items` - List all available items
4. **Add to Cart**: POST `/carts` - Add items to your cart (requires token)
5. **Checkout**: POST `/orders` - Convert cart to order (requires token)
6. **View Orders**: GET `/orders` - View your order history (requires token)

## API Endpoints

- POST `/users` - Create user
- GET `/users` - List users
- POST `/users/login` - Login
- POST `/items` - Create item
- GET `/items` - List items
- POST `/carts` - Create cart and add items (requires auth)
- GET `/carts` - List carts
- POST `/orders` - Create order from cart (requires auth)
- GET `/orders` - List orders (requires auth)

## Notes

- Each user can have only one cart
- Token is stored in the users table
- Token must be sent in Authorization header for protected endpoints
- Database tables will be created automatically on first run via GORM AutoMigrate

