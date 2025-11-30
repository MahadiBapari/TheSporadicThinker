# Backend Setup Guide

Complete guide to set up the backend server and database.

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Set Up Environment Variables

1. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update the following:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_actual_mysql_password  # ⚠️ Change this!
   DB_NAME=thesporadicthinker

   # JWT Secret (generate a secure one)
   JWT_SECRET=your_generated_secret_here    # ⚠️ Change this!
   ```

3. Generate a secure JWT secret:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as `JWT_SECRET` in your `.env` file.

## Step 3: Set Up MySQL Database

### Option A: Using Command Line

```bash
# Login to MySQL
mysql -u root -p

# Run the schema
source database/schema.sql
```

### Option B: Direct Command

```bash
mysql -u root -p < database/schema.sql
```

### Option C: Manual Setup

1. Create database:
   ```sql
   CREATE DATABASE thesporadicthinker;
   ```

2. Run the SQL from `database/schema.sql` in your MySQL client

## Step 4: Verify Database Connection

Test the connection by starting the server:

```bash
npm run dev
```

You should see:
```
Backend API running on port 4000
```

If you see connection errors, check:
- MySQL is running
- Database credentials in `.env` are correct
- Database `thesporadicthinker` exists

## Step 5: Create Your First Admin User

### Via API (Recommended)

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "SecurePassword123!"
  }'
```

### Via Frontend

1. Start the frontend: `cd ../frontend && npm run dev`
2. Go to `http://localhost:3000/admin/login`
3. Use the register endpoint first, then login

## Step 6: Test the Setup

1. **Health Check:**
   ```bash
   curl http://localhost:4000/api/health
   ```
   Should return: `{"status":"ok","uptime":...}`

2. **Login Test:**
   ```bash
   curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "SecurePassword123!"
     }'
   ```
   Should return a JWT token.

## Troubleshooting

### MySQL Connection Error

**Error:** `ER_ACCESS_DENIED_ERROR` or `ECONNREFUSED`

**Solutions:**
1. Verify MySQL is running:
   ```bash
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```

2. Check credentials in `.env` match your MySQL setup

3. Test connection manually:
   ```bash
   mysql -u root -p -h localhost
   ```

### Database Not Found

**Error:** `ER_BAD_DB_ERROR`

**Solution:** Run the schema.sql file to create the database:
```bash
mysql -u root -p < database/schema.sql
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::4000`

**Solution:** 
- Change `PORT` in `.env` to a different port (e.g., 4001)
- Or stop the process using port 4000

## Development Commands

```bash
# Start development server (with auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Next Steps

After backend is set up:
1. ✅ Database created and tables set up
2. ✅ Admin user created
3. ✅ Backend server running
4. ⏭️ Set up frontend (see `frontend/README.md`)
5. ⏭️ Create posts and categories via admin panel

