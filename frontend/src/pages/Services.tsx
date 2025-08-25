import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ServerIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


interface ServiceMetrics {
  name: string;
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  responseTime: number;
  uptime: number;
  requestsPerMinute: number;
  errorRate: number;
  lastCheck: string;
  health: {
    database: 'UP' | 'DOWN';
    memory: 'UP' | 'DOWN';
    disk: 'UP' | 'DOWN';
  };
}

const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('1h');

  // Fetch service metrics
  const { data: services, isLoading, refetch } = useQuery({
    queryKey: ['serviceMetrics'],
    queryFn: async (): Promise<ServiceMetrics[]> => {
      // Mock data - replace with real API calls
      return [
        {
          name: 'Eureka Server',
          status: 'UP',
          responseTime: 45,
          uptime: 99.9,
          requestsPerMinute: 120,
          errorRate: 0.1,
          lastCheck: '2 min ago',
          health: {
            database: 'UP',
            memory: 'UP',
            disk: 'UP',
          },
        },
        {
          name: 'API Gateway',
          status: 'UP',
          responseTime: 67,
          uptime: 99.8,
          requestsPerMinute: 450,
          errorRate: 0.5,
          lastCheck: '1 min ago',
          health: {
            database: 'UP',
            memory: 'UP',
            disk: 'UP',
          },
        },
        {
          name: 'Users Service',
          status: 'UP',
          responseTime: 89,
          uptime: 99.7,
          requestsPerMinute: 280,
          errorRate: 0.3,
          lastCheck: '30 sec ago',
          health: {
            database: 'UP',
            memory: 'UP',
            disk: 'UP',
          },
        },
        {
          name: 'Product Service',
          status: 'UP',
          responseTime: 76,
          uptime: 99.6,
          requestsPerMinute: 320,
          errorRate: 0.2,
          lastCheck: '1 min ago',
          health: {
            database: 'UP',
            memory: 'UP',
            disk: 'UP',
          },
        },
      ];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const performanceData = [
    { time: '00:00', eureka: 45, gateway: 67, users: 89, products: 76 },
    { time: '00:05', eureka: 42, gateway: 65, users: 87, products: 74 },
    { time: '00:10', eureka: 48, gateway: 70, users: 92, products: 79 },
    { time: '00:15', eureka: 44, gateway: 68, users: 88, products: 75 },
    { time: '00:20', eureka: 46, gateway: 66, users: 90, products: 77 },
    { time: '00:25', eureka: 43, gateway: 69, users: 86, products: 73 },
    { time: '00:30', eureka: 47, gateway: 71, users: 91, products: 78 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UP':
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
      case 'DOWN':
        return <XCircleIcon className="h-5 w-5 text-danger-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-warning-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UP':
        return 'text-success-600 bg-success-50';
      case 'DOWN':
        return 'text-danger-600 bg-danger-50';
      default:
        return 'text-warning-600 bg-warning-50';
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'text-success-600';
    if (uptime >= 99.5) return 'text-warning-600';
    return 'text-danger-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Monitor microservices health and performance</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field w-32"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <button
            onClick={() => refetch()}
            className="btn-secondary"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Service Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services?.map((service) => (
          <div 
            key={service.name} 
            className={`card cursor-pointer transition-all hover:shadow-medium ${
              selectedService === service.name ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setSelectedService(selectedService === service.name ? null : service.name)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ServerIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <div className="flex items-center mt-1">
                    {getStatusIcon(service.status)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Response Time:</span>
                <span className="font-medium">{service.responseTime}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uptime:</span>
                <span className={`font-medium ${getUptimeColor(service.uptime)}`}>
                  {service.uptime}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Requests/min:</span>
                <span className="font-medium">{service.requestsPerMinute}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Error Rate:</span>
                <span className="font-medium">{service.errorRate}%</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Last checked: {service.lastCheck}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="eureka" stroke="#3B82F6" strokeWidth={2} name="Eureka Server" />
            <Line type="monotone" dataKey="gateway" stroke="#10B981" strokeWidth={2} name="API Gateway" />
            <Line type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={2} name="Users Service" />
            <Line type="monotone" dataKey="products" stroke="#F59E0B" strokeWidth={2} name="Product Service" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Service Health */}
      {selectedService && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedService} - Detailed Health
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">System Health</h4>
              {services?.find(s => s.name === selectedService)?.health && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusColor(services.find(s => s.name === selectedService)?.health.database || 'UNKNOWN')
                    }`}>
                      {services.find(s => s.name === selectedService)?.health.database}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Memory</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusColor(services.find(s => s.name === selectedService)?.health.memory || 'UNKNOWN')
                    }`}>
                      {services.find(s => s.name === selectedService)?.health.memory}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Disk</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusColor(services.find(s => s.name === selectedService)?.health.disk || 'UNKNOWN')
                    }`}>
                      {services.find(s => s.name === selectedService)?.health.disk}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Performance Metrics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                  <span className="font-medium">
                    {services?.find(s => s.name === selectedService)?.responseTime}ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Requests/min</span>
                  <span className="font-medium">
                    {services?.find(s => s.name === selectedService)?.requestsPerMinute}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Error Rate</span>
                  <span className="font-medium">
                    {services?.find(s => s.name === selectedService)?.errorRate}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full btn-secondary text-sm py-2">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  View Logs
                </button>
                <button className="w-full btn-secondary text-sm py-2">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Restart Service
                </button>
                <button className="w-full btn-secondary text-sm py-2">
                  <ServerIcon className="h-4 w-4 mr-2" />
                  Health Check
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Logs Preview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Service Logs</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <div className="space-y-1">
            <div>[2024-01-15 14:30:25] INFO - Eureka Server: Service registry updated</div>
            <div>[2024-01-15 14:30:24] INFO - API Gateway: Route /api/v1/users configured</div>
            <div>[2024-01-15 14:30:23] INFO - Users Service: Health check passed</div>
            <div>[2024-01-15 14:30:22] INFO - Product Service: Database connection established</div>
            <div>[2024-01-15 14:30:21] INFO - Eureka Server: Client registered successfully</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
