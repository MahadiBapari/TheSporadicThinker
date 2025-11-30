# Database Setup Guide

This guide will help you set up the MySQL database for The Sporadic Thinker blog.

## Prerequisites

- MySQL installed and running
- MySQL root access (or a user with CREATE DATABASE privileges)

## Setup Steps

### 1. Create the Database and Tables

**Option A: Using MySQL Command Line**

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source /path/to/backend/database/schema.sql

# Or run directly
mysql -u root -p < database/schema.sql
```

**Option B: Using MySQL Workbench or phpMyAdmin**

1. Open MySQL Workbench or phpMyAdmin
2. Connect to your MySQL server
3. Open the `schema.sql` file
4. Execute the script

### 2. Verify Database Creation

```sql
USE thesporadicthinker;
SHOW TABLES;
```

You should see:
- users
- categories
- posts
- tags
- post_tags

### 3. Create Your First Admin User

After setting up the backend `.env` file, you can create an admin user via the API:

```bash
# Using curl
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "your_secure_password"
  }'
```

Or use the admin login page at `/admin/login` after registering.

## Database Structure

### Tables Overview

1. **users** - Stores admin/author accounts
2. **categories** - Blog post categories
3. **posts** - Blog posts/articles
4. **tags** - Post tags (optional)
5. **post_tags** - Junction table for post-tag relationships

### Important Notes

- All tables use `utf8mb4` charset for full Unicode support
- Foreign keys are set up with appropriate CASCADE/SET NULL actions
- Indexes are created on frequently queried columns
- Timestamps are automatically managed

## Troubleshooting

### Connection Issues

If you get connection errors:

1. Verify MySQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status mysql
   ```

2. Check your `.env` file credentials match your MySQL setup

3. Test connection:
   ```bash
   mysql -u root -p -h localhost
   ```

### Permission Issues

If you get permission errors:

```sql
-- Grant privileges (if needed)
GRANT ALL PRIVILEGES ON thesporadicthinker.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## Backup and Restore

### Backup
```bash
mysqldump -u root -p thesporadicthinker > backup.sql
```

### Restore
```bash
mysql -u root -p thesporadicthinker < backup.sql
```

