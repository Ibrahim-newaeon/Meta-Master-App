# Meta Master App - Frontend Setup Guide

## Overview

The Meta Master App frontend is a modern React application built with TypeScript and Tailwind CSS. It provides interactive dashboards for marketing analytics and insights, connecting to a backend API for data retrieval.

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Vite 7** - Fast build tool and dev server
- **React Router 7** - Client-side routing

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** (version 9.0.0 or higher)

## Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Development

### Running the Development Server

To start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API** (must be running separately): http://localhost:5000

The dev server includes a proxy configuration that forwards `/api` requests to the backend server at `http://localhost:5000`.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### Type Checking

To run TypeScript type checking without emitting files:

```bash
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AudienceBreakdown.tsx
│   │   ├── DashboardTable.tsx
│   │   ├── FilterBar.tsx
│   │   ├── KpiCards.tsx
│   │   ├── Layout.tsx
│   │   └── Loading.tsx
│   ├── pages/              # Page components (routes)
│   │   ├── Dashboard.tsx             # Overview page (/)
│   │   ├── TOFDashboard.tsx          # Top of Funnel (/tof)
│   │   ├── MOFDashboard.tsx          # Middle of Funnel (/mof)
│   │   ├── BOFDashboard.tsx          # Bottom of Funnel (/bof)
│   │   └── AudienceInsightsDashboard.tsx  # Audience Insights (/audience)
│   ├── services/           # API and external services
│   │   └── apiClient.ts    # Centralized API client
│   ├── types/              # TypeScript type definitions
│   │   └── api.ts
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles with Tailwind
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## Key Features

### 1. Routing

The app uses React Router with the following routes:

- `/` - Overview Dashboard
- `/tof` - Top of Funnel Dashboard
- `/mof` - Middle of Funnel Dashboard
- `/bof` - Bottom of Funnel Dashboard
- `/audience` - Audience Insights Dashboard

### 2. Shared Components

#### FilterBar
Provides filtering controls for:
- Country selection
- Date range (from/to)
- Campaign goal
- Funnel stage

#### KpiCards
Displays key performance indicators in a grid layout with:
- Label and value
- Optional icons
- Optional trend indicators

#### DashboardTable
Sortable data table with:
- Customizable columns
- Built-in formatting
- Sorting capabilities
- Empty state handling

#### AudienceBreakdown
Visualizes audience metrics with:
- Horizontal bar charts
- Percentage calculations
- Custom color schemes
- Total aggregations

### 3. API Client

All API calls go through a centralized `apiClient.ts` that:
- Handles request/response formatting
- Manages query parameters
- Provides type-safe API methods
- Connects to backend at `/api` endpoints

Available API methods:
- `fetchOverview(filters)` - Overview KPIs and funnel summary
- `fetchTOF(filters)` - Top of funnel campaign data
- `fetchMOF(filters)` - Middle of funnel campaign data
- `fetchBOF(filters)` - Bottom of funnel campaign data
- `fetchAudienceDemographics(filters)` - Demographics breakdown
- `fetchAudienceLocation(filters)` - Location breakdown
- `fetchAudienceDevice(filters)` - Device breakdown
- `fetchAudiencePlatform(filters)` - Platform breakdown

## Backend Integration

### Backend Setup

The frontend expects a backend API running at `http://localhost:5000`. To set up the backend:

1. Navigate to the backend directory (from project root)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (copy `.env.example` to `.env`)
4. Start the backend server:
   ```bash
   npm start
   ```

### API Endpoints

The frontend connects to these backend endpoints:

- `GET /api/insights/overview` - Overview dashboard data
- `GET /api/insights/tof` - Top of funnel metrics
- `GET /api/insights/mof` - Middle of funnel metrics
- `GET /api/insights/bof` - Bottom of funnel metrics
- `GET /api/audience/demographics` - Demographic breakdowns
- `GET /api/audience/location` - Location breakdowns
- `GET /api/audience/device` - Device breakdowns
- `GET /api/audience/platform` - Platform breakdowns

All endpoints accept the following query parameters:
- `country` - Country filter (e.g., "KSA", "Kuwait", "Qatar", "All")
- `account_id` - Specific account ID
- `date_from` - Start date (ISO format: YYYY-MM-DD)
- `date_to` - End date (ISO format: YYYY-MM-DD)
- `campaign_goal` - Campaign objective filter
- `funnel_stage` - Funnel stage filter (TOF, MOF, BOF)

## Styling with Tailwind CSS

The app uses Tailwind CSS for styling. Key color scheme:

- **Background**: Gray-900 (#0e1117)
- **Cards**: Gray-800
- **Primary**: Blue-600
- **Success**: Green-500
- **Warning**: Amber-500
- **Error**: Red-500

Custom styles can be added to `src/index.css`.

## Environment Variables

The frontend uses Vite's environment variable system. Create a `.env` file in the frontend directory if needed:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
npm run dev -- --port 3001
```

### Backend Connection Issues

Ensure the backend server is running on port 5000. Check the proxy configuration in `vite.config.ts` if needed.

### TypeScript Errors

Run type checking to see detailed errors:

```bash
npm run lint
```

### Build Errors

Clear the cache and rebuild:

```bash
rm -rf node_modules dist
npm install
npm run build
```

## Development Workflow

1. Start the backend server (in a separate terminal)
2. Start the frontend dev server: `npm run dev`
3. Make changes to source files
4. View changes automatically in the browser (HMR)
5. Build for production when ready: `npm run build`

## Browser Support

The app supports modern browsers:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Performance Tips

- Use React DevTools to profile component renders
- Lazy load heavy components if needed
- Optimize images and assets
- Use production builds for deployment

## Extending the Application

### Adding a New Dashboard

1. Create a new page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Layout.tsx`
4. Create API method in `src/services/apiClient.ts` if needed
5. Define TypeScript types in `src/types/api.ts` if needed

### Adding a New Component

1. Create component file in `src/components/`
2. Export component
3. Import and use in pages or other components
4. Add TypeScript props interface

### Customizing Styles

1. Edit Tailwind configuration in `tailwind.config.js`
2. Add custom CSS in `src/index.css`
3. Use Tailwind utility classes in components

## Support

For issues or questions:
- Check the console for error messages
- Review the TypeScript types for API contracts
- Verify backend connectivity
- Check browser network tab for API responses

## License

ISC
