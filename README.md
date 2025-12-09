# Meta Master App

A modern full-stack marketing analytics dashboard for Meta (Facebook/Instagram) advertising campaigns, built with React, TypeScript, Tailwind CSS, and Node.js.

## 🚀 Project Overview

Meta Master App provides comprehensive insights into marketing funnel performance across Top of Funnel (TOF), Middle of Funnel (MOF), and Bottom of Funnel (BOF) stages. It features:

- **Modern React Frontend** - Built with React 19, TypeScript, and Tailwind CSS
- **RESTful Backend API** - Node.js/Express server with PostgreSQL
- **Marketing Analytics** - KPI tracking, campaign performance, and audience insights
- **Multi-Country Support** - Manage campaigns across multiple regions
- **Real-time Data** - Integration with Meta Marketing API

## 📁 Project Structure

```
Meta-Master-App/
├── frontend/           # React + TypeScript + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Dashboard pages
│   │   ├── services/       # API client
│   │   └── types/          # TypeScript types
│   ├── package.json
│   └── HOW_TO_RUN.md      # Frontend setup guide
│
├── backend/            # Node.js/Express backend API
│   ├── routes/            # API route handlers
│   ├── server.js          # Main server file
│   ├── package.json
│   └── README.md          # Backend documentation
│
├── .env.example        # Environment variables template
└── README.md          # This file
```

## 🎯 Features

### Dashboard Pages

1. **Overview Dashboard** (`/`)
   - Overall KPIs and performance metrics
   - Funnel stage comparison
   - Country-level analysis

2. **Top of Funnel** (`/tof`)
   - Awareness metrics (Reach, Impressions, Frequency)
   - Video views and engagement
   - CPM and CTR tracking

3. **Middle of Funnel** (`/mof`)
   - Traffic and engagement metrics
   - Landing page views
   - Cost per click analysis

4. **Bottom of Funnel** (`/bof`)
   - Conversion tracking
   - Revenue and ROAS
   - Cost per acquisition

5. **Audience Insights** (`/audience`)
   - Demographics breakdown
   - Geographic distribution
   - Device and platform analysis

### Key Components

- **FilterBar** - Date range, country, campaign goal, and funnel stage filters
- **KpiCards** - Key performance indicator displays with trend indicators
- **DashboardTable** - Sortable data tables with custom formatting
- **AudienceBreakdown** - Visual breakdown charts with percentages

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Vite 7** - Fast build tool and dev server
- **React Router 7** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **PostgreSQL** - Relational database
- **Meta Marketing API** - Campaign data source

## 🚦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL (optional for development)

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

For detailed frontend setup, see [frontend/HOW_TO_RUN.md](frontend/HOW_TO_RUN.md)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start server:
   ```bash
   npm start
   ```

5. Server runs at http://localhost:5000

For detailed backend setup, see [backend/README.md](backend/README.md)

## 🔧 Development

### Running Both Frontend and Backend

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will proxy API requests to the backend automatically.

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

**Backend:**
The backend runs directly with Node.js, no build step required.

## 📊 API Endpoints

### Insights
- `GET /api/insights/overview` - Overview metrics
- `GET /api/insights/tof` - Top of funnel data
- `GET /api/insights/mof` - Middle of funnel data
- `GET /api/insights/bof` - Bottom of funnel data

### Audience
- `GET /api/audience/demographics` - Age/gender breakdown
- `GET /api/audience/location` - Geographic data
- `GET /api/audience/device` - Device breakdown
- `GET /api/audience/platform` - Platform breakdown

### Config
- `GET /api/config/accounts` - Available accounts

All endpoints support filtering by:
- `country` - Country filter
- `date_from` / `date_to` - Date range
- `campaign_goal` - Campaign objective
- `funnel_stage` - Funnel stage (TOF/MOF/BOF)

## 🎨 Design System

The app uses a dark theme with the following color palette:

- **Background:** Gray-900 (#0e1117)
- **Cards:** Gray-800
- **Primary:** Blue-600
- **Success:** Green-500
- **Warning:** Amber-500
- **Error:** Red-500

## 📝 Environment Variables

Create `.env` files in both frontend and backend directories. See `.env.example` for required variables.

Key backend variables:
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `META_APP_ID` - Meta app ID
- `META_ACCESS_TOKEN` - Meta API token
- `ALLOWED_ORIGINS` - CORS origins

## 🧪 Testing

**TypeScript Type Checking:**
```bash
cd frontend
npm run lint
```

**Build Test:**
```bash
cd frontend
npm run build
```

## 📱 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 🆘 Troubleshooting

### Frontend won't start
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check for port conflicts on 3000

### Backend connection errors
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify .env settings

### Build errors
- Run `npm run lint` to check for TypeScript errors
- Clear build cache: `rm -rf dist node_modules`
- Reinstall dependencies

## 📞 Support

For issues and questions:
- Check the console for detailed error messages
- Review the HOW_TO_RUN.md files
- Verify environment configuration
- Check network tab for API responses

---

Built with ❤️ for modern marketing analytics
