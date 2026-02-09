# Audit Trail Dashboard

A simple dashboard to view audit trail records from a MySQL database with filtering by table name and date range.

## Prerequisites

- Node.js (v18 or higher)
- MySQL database with an `Audittrail` table

## Database Schema

The dashboard expects an `Audittrail` table with the following structure:

```sql
CREATE TABLE Audittrail (
  id INT PRIMARY KEY AUTO_INCREMENT,
  table_name VARCHAR(255) NOT NULL,
  record_id INT NOT NULL,
  action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  before_state JSON,
  after_state JSON,
  diff JSON,
  changed_by VARCHAR(255) NOT NULL,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your database credentials:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your MySQL connection details:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=your_database
   PORT=3000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend

Option 1: Open directly in browser
- Open `frontend/index.html` in your browser

Option 2: Serve with a static server
```bash
npx serve frontend
```

## API Endpoints

### GET /api/audit-trail

Fetch audit trail records with optional filtering and pagination.

**Query Parameters:**
- `tableName` (optional): Filter by specific table name
- `startDate` (optional): Filter records from this date (YYYY-MM-DD)
- `endDate` (optional): Filter records until this date (YYYY-MM-DD)
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 50): Records per page

**Response:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 50,
  "totalPages": 2
}
```

### GET /api/audit-trail/tables

Get list of distinct table names for the filter dropdown.

**Response:**
```json
["users", "orders", "products"]
```

## Testing

Test the API:
```bash
curl "http://localhost:3000/api/audit-trail"
curl "http://localhost:3000/api/audit-trail?tableName=users&startDate=2024-01-01"
curl "http://localhost:3000/api/audit-trail/tables"
```

## Project Structure

```
audit-trail-dashboard/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express server entry point
│   │   ├── db.ts             # MySQL connection setup
│   │   └── routes/
│   │       └── audit.ts      # Audit trail API routes
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── index.html            # Dashboard UI
│   ├── styles.css            # Styling
│   └── app.js                # Frontend JavaScript
└── README.md
```
