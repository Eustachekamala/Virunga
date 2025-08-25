import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  UsersIcon, 
  CubeIcon, 
  ServerIcon, 
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


interface ServiceStatus {
  name: string;
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  responseTime: number;
  lastCheck: string;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

const Dashboard: React.FC = () => {
  // Mock data for demonstration - replace with real API calls
  const { data: serviceStatus } = useQuery({
    queryKey: ['serviceStatus'],
    queryFn: async (): Promise<ServiceStatus[]> => {
      // This would be a real API call in production
      return [
        { name: 'Eureka Server', status: 'UP', responseTime: 45, lastCheck: '2 min ago' },
        { name: 'API Gateway', status: 'UP', responseTime: 67, lastCheck: '1 min ago' },
        { name: 'Users Service', status: 'UP', responseTime: 89, lastCheck: '30 sec ago' },
        { name: 'Product Service', status: 'UP', responseTime: 76, lastCheck: '1 min ago' },
      ];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      // Mock metrics data
      return {
        totalUsers: 1247,
        totalProducts: 892,
        activeServices: 4,
        totalRequests: 45678,
      };
    },
  });

  const metricCards: MetricCard[] = [
    {
      title: 'Total Users',
      value: metrics?.totalUsers || 0,
      change: '+12%',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: metrics?.totalProducts || 0,
      change: '+8%',
      changeType: 'positive',
      icon: CubeIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Active Services',
      value: metrics?.activeServices || 0,
      change: '100%',
      changeType: 'positive',
      icon: ServerIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Requests',
      value: metrics?.totalRequests?.toLocaleString() || 0,
      change: '+23%',
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'bg-orange-500',
    },
  ];

  const chartData = [
    { name: 'Mon', users: 120, products: 80, requests: 2400 },
    { name: 'Tue', users: 140, products: 90, requests: 2800 },
    { name: 'Wed', users: 160, products: 100, requests: 3200 },
    { name: 'Thu', users: 180, products: 110, requests: 3600 },
    { name: 'Fri', users: 200, products: 120, requests: 4000 },
    { name: 'Sat', users: 220, products: 130, requests: 4400 },
    { name: 'Sun', users: 240, products: 140, requests: 4800 },
  ];

  const pieData = [
    { name: 'Users Service', value: 35, color: '#3B82F6' },
    { name: 'Product Service', value: 30, color: '#10B981' },
    { name: 'API Gateway', value: 20, color: '#8B5CF6' },
    { name: 'Eureka Server', value: 15, color: '#F59E0B' },
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Monitor your microservices architecture in real-time</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className={`text-sm ${
                  card.changeType === 'positive' ? 'text-success-600' : 
                  card.changeType === 'negative' ? 'text-danger-600' : 'text-gray-600'
                }`}>
                  {card.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="products" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="requests" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Check
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {serviceStatus?.map((service, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <ServerIcon className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(service.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.responseTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.lastCheck}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary">
            <UsersIcon className="h-5 w-5 mr-2" />
            Add New User
          </button>
          <button className="btn-secondary">
            <CubeIcon className="h-5 w-5 mr-2" />
            Create Product
          </button>
          <button className="btn-secondary">
            <ServerIcon className="h-5 w-5 mr-2" />
            View Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
