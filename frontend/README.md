# 🎨 Virunga Frontend

A modern, responsive React frontend for the Virunga Microservices Architecture dashboard.

## ✨ Features

- **Modern UI/UX**: Built with React 18, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful responsive layouts
- **Real-time Monitoring**: Live service health monitoring and metrics
- **Interactive Charts**: Beautiful data visualization with Recharts
- **Authentication**: JWT-based authentication with secure routing
- **State Management**: Efficient state management with Zustand
- **API Integration**: Seamless integration with microservices
- **Dark Mode Ready**: Built with dark mode support in mind

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for lightweight state management
- **Data Fetching**: React Query (TanStack Query) for server state
- **Routing**: React Router v6 for client-side routing
- **Charts**: Recharts for data visualization
- **Icons**: Heroicons for beautiful iconography
- **Forms**: React Hook Form for form handling
- **Notifications**: React Hot Toast for user feedback
- **Build Tool**: Create React App with custom configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Running microservices backend

### Development

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   # or use the script
   ./start-dev.sh
   ```

3. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
```

The built files will be in the `build/` directory.

## 🏗️ Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   └── Layout.tsx     # Main layout with sidebar
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx  # Main dashboard
│   │   ├── Users.tsx      # User management
│   │   ├── Products.tsx   # Product management
│   │   ├── Services.tsx   # Service monitoring
│   │   └── Login.tsx      # Authentication
│   ├── stores/            # State management
│   │   └── authStore.ts   # Authentication state
│   ├── services/          # API services
│   │   └── api.ts         # HTTP client & endpoints
│   ├── App.tsx            # Main application component
│   ├── index.tsx          # Application entry point
│   └── index.css          # Global styles
├── package.json            # Dependencies & scripts
├── tailwind.config.js      # Tailwind configuration
├── Dockerfile             # Container configuration
└── nginx.conf             # Nginx configuration
```

## 🎨 Design System

### Colors

- **Primary**: Blue shades for main actions and branding
- **Secondary**: Gray shades for neutral elements
- **Success**: Green for positive states
- **Warning**: Yellow for caution states
- **Danger**: Red for error states

### Components

- **Buttons**: Primary, secondary, and danger variants
- **Cards**: Consistent card layouts with shadows
- **Forms**: Styled form inputs with validation
- **Tables**: Responsive data tables
- **Modals**: Overlay dialogs for actions
- **Charts**: Interactive data visualizations

### Typography

- **Font Family**: Inter for body text, JetBrains Mono for code
- **Font Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scalable typography system

## 📱 Pages

### Dashboard
- **Overview**: Key metrics and service status
- **Charts**: Weekly activity and service distribution
- **Quick Actions**: Common tasks and shortcuts

### Users
- **User Management**: CRUD operations for user accounts
- **Search & Filter**: Advanced user filtering
- **Role Management**: Role-based access control

### Products
- **Product Catalog**: Visual product grid
- **Categories**: Consumable vs non-consumable
- **Image Management**: Product image handling

### Services
- **Health Monitoring**: Real-time service status
- **Performance Metrics**: Response times and uptime
- **Logs**: Service log preview

## 🔐 Authentication

### Features
- JWT-based authentication
- Protected routes
- Role-based access control
- Persistent login state

### Flow
1. User enters credentials
2. Backend validates and returns JWT
3. Frontend stores token securely
4. Token included in API requests
5. Automatic logout on token expiry

## 🌐 API Integration

### Configuration
- Base URL: Configurable via environment variables
- Timeout: 10 seconds for requests
- Interceptors: Automatic token injection and error handling

### Endpoints
- **Auth**: Login, logout, user management
- **Users**: CRUD operations for user accounts
- **Products**: Product management and catalog
- **Health**: Service health checks and metrics

## 📊 Data Visualization

### Charts
- **Line Charts**: Time-series data (response times, requests)
- **Pie Charts**: Service distribution and metrics
- **Responsive**: Mobile-optimized chart layouts

### Metrics
- **Real-time**: Live data updates every 30 seconds
- **Historical**: Time-based data analysis
- **Performance**: Response times, uptime, error rates

## 🐳 Docker Deployment

### Build
```bash
docker build -t virunga-frontend .
```

### Run
```bash
docker run -p 3000:80 virunga-frontend
```

### Docker Compose
The frontend is included in the main `docker-compose.yml` file.

## 🔧 Configuration

### Environment Variables

```bash
REACT_APP_API_URL=http://localhost:8765
REACT_APP_ENVIRONMENT=development
```

### Tailwind Configuration

Custom colors, fonts, and animations are defined in `tailwind.config.js`.

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Features
- Mobile-first approach
- Responsive navigation
- Adaptive layouts
- Touch-friendly interactions

## 🚀 Performance

### Optimizations
- Code splitting with React.lazy
- Optimized bundle size
- Efficient re-renders
- Lazy loading for images

### Monitoring
- Bundle analyzer integration
- Performance metrics
- Error tracking ready

## 🧪 Testing

### Setup
```bash
npm test
```

### Coverage
```bash
npm run test:coverage
```

## 📦 Build & Deploy

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Docker Production
```bash
docker build -t virunga-frontend:latest .
docker run -d -p 3000:80 virunga-frontend:latest
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Create an issue in the repository

---

**Happy Coding! 🚀**


