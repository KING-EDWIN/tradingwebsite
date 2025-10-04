# Trading Website Database Integration - Deployment Guide

Your trading website at [https://tradingwebsite-kappa.vercel.app/](https://tradingwebsite-kappa.vercel.app/) is now ready for database integration!

## 🚀 What's Been Added

### Database Schema
- **Users Table**: User authentication and account management
- **Trades Table**: All trading transactions
- **Portfolio Table**: User holdings and positions
- **Market Data Table**: Real-time price data
- **Admin Users Table**: Admin access control

### API Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/market-data` - Get market prices
- `POST /api/market-data` - Update market prices
- `GET /api/trades?user_id=X` - Get user trades
- `POST /api/trades` - Execute trades
- `GET /api/portfolio?user_id=X` - Get user portfolio
- `GET /api/init-db` - Initialize database

### Frontend Features
- **User Authentication**: Login/Register modal
- **Real-time Data**: Live market prices and portfolio updates
- **Trading Interface**: Execute buy/sell orders
- **Portfolio Management**: View holdings and P&L
- **User Session**: Persistent login with localStorage

## 📋 Deployment Steps

### Step 1: Install Dependencies
```bash
cd /Users/kingedwin/trading/tradingwebsite
npm install
```

### Step 2: Deploy to Vercel
```bash
vercel --prod
```

### Step 3: Add Vercel Postgres Database
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `tradingwebsite` project
3. Go to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Choose **Free Tier**
6. Name it: `trading-db`

### Step 4: Set Environment Variables
In your Vercel project settings → Environment Variables, add:

```
POSTGRES_URL=your_postgres_url_here
POSTGRES_PRISMA_URL=your_postgres_prisma_url_here
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling_here
POSTGRES_USER=your_postgres_user_here
POSTGRES_HOST=your_postgres_host_here
POSTGRES_PASSWORD=your_postgres_password_here
POSTGRES_DATABASE=your_postgres_database_here
JWT_SECRET=your-super-secret-jwt-key-here
```

### Step 5: Initialize Database
Visit: `https://tradingwebsite-kappa.vercel.app/api/init-db`

This will create all tables and insert sample data.

## 🧪 Testing Your Setup

### 1. Test Database Connection
Visit: `https://tradingwebsite-kappa.vercel.app/api/init-db`
Should return: `{"success": true, "message": "Database initialized successfully"}`

### 2. Test User Registration
```bash
curl -X POST https://tradingwebsite-kappa.vercel.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 3. Test User Login
```bash
curl -X POST https://tradingwebsite-kappa.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 4. Test Market Data
Visit: `https://tradingwebsite-kappa.vercel.app/api/market-data`

## 🎯 How to Use

### For Users
1. **Visit the website**: [https://tradingwebsite-kappa.vercel.app/](https://tradingwebsite-kappa.vercel.app/)
2. **Register/Login**: Click the login button to create an account
3. **Start Trading**: Use the trading interface to buy/sell assets
4. **View Portfolio**: Check your holdings and P&L in the portfolio section
5. **Monitor Markets**: View real-time market data

### For Admins
- **Default Admin**: `admin@tradingplatform.com` / `admin123`
- **Manage Users**: Access user data through API endpoints
- **Update Market Data**: POST to `/api/market-data` to update prices

## 🔧 API Usage Examples

### Register a New User
```javascript
const response = await fetch('/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securepassword'
  })
});
```

### Execute a Trade
```javascript
const response = await fetch('/api/trades', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'user-id-here',
    symbol: 'BTC',
    type: 'buy',
    quantity: 0.1,
    price: 45000
  })
});
```

### Get Portfolio
```javascript
const response = await fetch('/api/portfolio?user_id=user-id-here');
const portfolio = await response.json();
```

## 📊 Database Schema Details

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  balance DECIMAL(15,2) DEFAULT 10000.00,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Trades Table
```sql
CREATE TABLE trades (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('buy', 'sell')),
  quantity DECIMAL(15,8) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP
);
```

## 🚨 Important Notes

1. **Free Tier Limits**: Vercel Postgres free tier includes 1GB storage and 1 billion reads/month
2. **Security**: Passwords are hashed with bcrypt
3. **CORS**: All API endpoints have CORS enabled for web access
4. **Real-time Updates**: Market data updates every 30 seconds
5. **Session Management**: User sessions are stored in localStorage

## 🔍 Troubleshooting

### Database Connection Issues
- Check environment variables are set correctly
- Ensure database is created and active in Vercel
- Visit `/api/init-db` to test connection

### API Errors
- Check Vercel function logs in dashboard
- Verify request format and required fields
- Ensure user is authenticated for protected endpoints

### Frontend Issues
- Clear browser localStorage if login issues persist
- Check browser console for JavaScript errors
- Verify API endpoints are accessible

## 🎉 You're All Set!

Your trading website now has:
- ✅ Real database storage
- ✅ User authentication
- ✅ Trading functionality
- ✅ Portfolio management
- ✅ Real-time market data
- ✅ Admin controls

Start trading at: [https://tradingwebsite-kappa.vercel.app/](https://tradingwebsite-kappa.vercel.app/)

