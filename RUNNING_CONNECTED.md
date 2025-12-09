# Running Meta Master App with Frontend-Backend Connection

This guide shows how to run both the frontend and backend together with a working API connection.

## Quick Start (Mock Data)

The easiest way to test the full stack is using the mock server, which doesn't require a database:

### Terminal 1 - Backend (Mock Server)
```bash
cd backend
node mock-server.js
```

The backend will start on http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

The frontend will start on http://localhost:3000

### Open Browser
Navigate to http://localhost:3000 and you'll see:
- ✅ All dashboards working
- ✅ Real-time data from backend API
- ✅ All filters and navigation functional

## Mock Server Features

The `backend/mock-server.js` provides:
- ✅ All API endpoints with realistic data
- ✅ No database required
- ✅ Instant setup for development/demo
- ✅ Request logging to console

### Available Endpoints
- `GET /health` - Health check
- `GET /api/insights/overview` - Overview metrics
- `GET /api/insights/tof` - Top of Funnel campaigns
- `GET /api/insights/mof` - Middle of Funnel campaigns
- `GET /api/insights/bof` - Bottom of Funnel campaigns
- `GET /api/audience/demographics` - Demographics breakdown
- `GET /api/audience/location` - Location breakdown
- `GET /api/audience/device` - Device breakdown
- `GET /api/audience/platform` - Platform breakdown

## Production Setup (Real Database)

For production with a PostgreSQL database:

### Terminal 1 - Backend (Production)
```bash
cd backend
# Set up .env with real database credentials
cp .env.example .env
# Edit .env with your database URL

# Install dependencies
npm install

# Start production server
npm start
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

## Testing the Connection

### 1. Check Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-12-09T..."}
```

### 2. Test API Endpoint
```bash
curl "http://localhost:5000/api/insights/overview?date_from=2024-01-01&date_to=2024-12-31"
```

### 3. Verify Frontend
Open browser to http://localhost:3000 and check:
- KPI cards show data (not "Loading...")
- Tables have rows with data
- No error messages in red
- Browser console has no errors

## Backend Logs

The backend logs every API request:
```
2024-12-09T15:46:50.276Z - GET /api/insights/overview
📊 Overview request received
```

## Architecture

```
Frontend (React)              Backend (Express)
http://localhost:3000   →     http://localhost:5000
     ↓                              ↓
  apiClient.ts              routes/insights.js
  (fetch API)               routes/audience.js
     ↓                              ↓
  Types/Interfaces          Mock Data / Database
```

## API Request Flow

1. User opens dashboard page
2. React component calls `apiClient.fetchOverview(filters)`
3. Vite proxy forwards `/api/*` to `http://localhost:5000`
4. Express routes handle request
5. Mock server returns sample data (or DB query in production)
6. Frontend receives JSON response
7. React displays data in components

## Troubleshooting

### Backend Not Responding
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check logs
tail -f /tmp/backend.log  # if running in background
```

### Frontend Can't Connect
1. Verify backend is running on port 5000
2. Check Vite proxy config in `frontend/vite.config.ts`
3. Check browser console for CORS errors
4. Verify CORS is configured in backend

### CORS Issues
Backend `mock-server.js` already allows:
```javascript
origin: ['http://localhost:3000', 'http://localhost:8000']
```

### Port Already in Use
Change ports in:
- Backend: `PORT=5001` in `.env`
- Frontend: `server.port` in `vite.config.ts`

## Development Tips

### Watch Backend Logs in Real-Time
```bash
cd backend
node mock-server.js | tee backend.log
```

### Hot Module Replacement (HMR)
Frontend changes automatically reload in browser. Backend changes require restart.

### Filter Testing
Use the FilterBar to test different query parameters:
- Change date range
- Select different countries
- Filter by campaign goal
- Filter by funnel stage

The backend receives these as query parameters.

## Production Deployment

### Frontend Build
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

Serve `dist/` with nginx, Apache, or CDN.

### Backend
```bash
cd backend
npm start
```

Use PM2 or systemd for process management:
```bash
pm2 start server.js --name meta-backend
```

### Environment Variables
Production `.env` should have:
- Real `DATABASE_URL`
- Production `ALLOWED_ORIGINS`
- `NODE_ENV=production`

## Summary

✅ Frontend and backend are **fully connected**
✅ Mock server enables **instant testing**
✅ Production server uses **real database**
✅ API integration is **type-safe** with TypeScript
✅ All dashboards load **real-time data**

For detailed frontend setup: See `frontend/HOW_TO_RUN.md`
For backend API docs: See `backend/README.md`
