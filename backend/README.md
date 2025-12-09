# Meta Master App - Backend API

## Overview

The Meta Master App backend is a Node.js/Express API server that provides marketing analytics and insights data. It connects to a PostgreSQL database and optionally integrates with the Meta Marketing API.

## Prerequisites

- Node.js (version 14.0.0 or higher)
- npm (version 6.0.0 or higher)
- PostgreSQL database (optional for development)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file with your configuration

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Insights Endpoints
- `GET /api/insights/overview` - Overview dashboard KPIs and funnel summary
- `GET /api/insights/tof` - Top of funnel campaign metrics
- `GET /api/insights/mof` - Middle of funnel campaign metrics
- `GET /api/insights/bof` - Bottom of funnel campaign metrics

### Audience Endpoints
- `GET /api/audience/demographics` - Demographics breakdown
- `GET /api/audience/location` - Location breakdown
- `GET /api/audience/device` - Device breakdown
- `GET /api/audience/platform` - Platform breakdown

### Config Endpoints
- `GET /api/config/accounts` - Available account configurations

## Query Parameters

All insights and audience endpoints support the following filters:

- `country` - Filter by country (e.g., "KSA", "Kuwait", "Qatar", "All")
- `account_id` - Filter by specific account ID
- `date_from` - Start date (ISO format: YYYY-MM-DD)
- `date_to` - End date (ISO format: YYYY-MM-DD)
- `campaign_goal` - Filter by campaign objective
- `funnel_stage` - Filter by funnel stage (TOF, MOF, BOF)

## Project Structure

```
backend/
├── routes/
│   ├── insights.js      # Insights/analytics endpoints
│   ├── audience.js      # Audience breakdown endpoints
│   └── config.js        # Configuration endpoints
├── countryAccountMapper.js  # Country to account mapping
├── funnelMapper.js          # Campaign to funnel stage mapping
├── metaClient.js            # Meta API client
├── etlfetchMetaData.js      # ETL data fetching
├── server.js                # Main server entry point
├── package.json             # Dependencies and scripts
└── .env.example             # Environment variables template
```

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `META_APP_ID` - Meta app ID for API integration
- `META_ACCESS_TOKEN` - Meta API access token
- `ALLOWED_ORIGINS` - CORS allowed origins (comma-separated)

## Database Setup

The backend expects a PostgreSQL database with the schema defined in `databseschema.sql`.

To set up the database:

1. Create a PostgreSQL database
2. Run the schema file:
   ```bash
   psql -d meta_funnel_db -f databseschema.sql
   ```

## Troubleshooting

### Port already in use
Change the port in `.env` file:
```
PORT=5001
```

### Database connection errors
Verify your `DATABASE_URL` in `.env` and ensure PostgreSQL is running.

### CORS errors
Add your frontend URL to `ALLOWED_ORIGINS` in `.env`.

## Development Notes

- The server uses Express.js for routing and middleware
- PostgreSQL is used for data storage
- The Meta Marketing API is used for fetching campaign data
- CORS is configured to allow frontend access

## License

ISC
