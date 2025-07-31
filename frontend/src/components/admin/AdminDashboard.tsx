import { Users, Wifi, HardDrive, DollarSign, TrendingUp } from 'lucide-react';
import Layout from './Layout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTenant } from '../../contexts/TenantContext'; // Import useTenant
import { useEffect, useState } from 'react';

const allStats = [
  {
    tenantId: 'default-tenant',
    title: 'Total Users',
    value: '1,234',
    change: '+12% from yesterday',
    icon: Users,
    color: 'bg-blue-500',
    textColor: 'text-blue-600'
  },
  {
    tenantId: 'default-tenant',
    title: 'Active Sessions',
    value: '89',
    change: '+5% from yesterday',
    icon: Wifi,
    color: 'bg-green-500',
    textColor: 'text-green-600'
  },
  {
    tenantId: 'default-tenant',
    title: 'Data Usage',
    value: '2.4 TB',
    change: '+16% from yesterday',
    icon: HardDrive,
    color: 'bg-purple-500',
    textColor: 'text-purple-600'
  },
  {
    tenantId: 'default-tenant',
    title: 'Revenue Today',
    value: '$156',
    change: '+8% from yesterday',
    icon: DollarSign,
    color: 'bg-orange-500',
    textColor: 'text-orange-600'
  },
  // Example stats for another tenant
  {
    tenantId: 'tenant-1700000000000', // Example ID for a new tenant
    title: 'Total Users',
    value: '567',
    change: '+8% from yesterday',
    icon: Users,
    color: 'bg-blue-500',
    textColor: 'text-blue-600'
  },
  {
    tenantId: 'tenant-1700000000000',
    title: 'Active Sessions',
    value: '35',
    change: '+2% from yesterday',
    icon: Wifi,
    color: 'bg-green-500',
    textColor: 'text-green-600'
  },
  {
    tenantId: 'tenant-1700000000000',
    title: 'Data Usage',
    value: '1.1 TB',
    change: '+10% from yesterday',
    icon: HardDrive,
    color: 'bg-purple-500',
    textColor: 'text-purple-600'
  },
  {
    tenantId: 'tenant-1700000000000',
    title: 'Revenue Today',
    value: '$75',
    change: '+3% from yesterday',
    icon: DollarSign,
    color: 'bg-orange-500',
    textColor: 'text-orange-600'
  }
];

const allRecentActivity = [
  { tenantId: 'default-tenant', user: 'John Doe', action: 'Connected via WhatsApp', time: '2 minutes ago', status: 'online' },
  { tenantId: 'default-tenant', user: 'Jane Smith', action: 'Logged in with Google', time: '5 minutes ago', status: 'online' },
  { tenantId: 'default-tenant', user: 'Bob Johnson', action: 'Disconnected', time: '10 minutes ago', status: 'offline' },
  { tenantId: 'default-tenant', user: 'Alice Brown', action: 'Member login', time: '15 minutes ago', status: 'online' },
  // Example activity for another tenant
  { tenantId: 'tenant-1700000000000', user: 'TenantX User1', action: 'Connected via WhatsApp', time: '1 hour ago', status: 'online' },
  { tenantId: 'tenant-1700000000000', user: 'TenantX User2', action: 'Member login', time: '2 hours ago', status: 'offline' },
];

const allUserActivityData = [
  { tenantId: 'default-tenant', day: 'Mon', users: 65, sessions: 45 },
  { tenantId: 'default-tenant', day: 'Tue', users: 78, sessions: 52 },
  { tenantId: 'default-tenant', day: 'Wed', users: 90, sessions: 61 },
  { tenantId: 'default-tenant', day: 'Thu', users: 81, sessions: 58 },
  { tenantId: 'default-tenant', day: 'Fri', users: 95, sessions: 65 },
  { tenantId: 'default-tenant', day: 'Sat', users: 115, sessions: 78 },
  { tenantId: 'default-tenant', day: 'Sun', users: 88, sessions: 62 },
  // Example data for another tenant
  { tenantId: 'tenant-1700000000000', day: 'Mon', users: 30, sessions: 20 },
  { tenantId: 'tenant-1700000000000', day: 'Tue', users: 35, sessions: 25 },
  { tenantId: 'tenant-1700000000000', day: 'Wed', users: 40, sessions: 30 },
  { tenantId: 'tenant-1700000000000', day: 'Thu', users: 38, sessions: 28 },
  { tenantId: 'tenant-1700000000000', day: 'Fri', users: 42, sessions: 32 },
  { tenantId: 'tenant-1700000000000', day: 'Sat', users: 50, sessions: 38 },
  { tenantId: 'tenant-1700000000000', day: 'Sun', users: 45, sessions: 30 }
];

const allDailySessionsData = [
  { tenantId: 'default-tenant', day: 'Mon', sessions: 45 },
  { tenantId: 'default-tenant', day: 'Tue', sessions: 52 },
  { tenantId: 'default-tenant', day: 'Wed', sessions: 61 },
  { tenantId: 'default-tenant', day: 'Thu', sessions: 58 },
  { tenantId: 'default-tenant', day: 'Fri', sessions: 65 },
  { tenantId: 'default-tenant', day: 'Sat', sessions: 78 },
  { tenantId: 'default-tenant', day: 'Sun', sessions: 62 },
  // Example data for another tenant
  { tenantId: 'tenant-1700000000000', day: 'Mon', sessions: 20 },
  { tenantId: 'tenant-1700000000000', day: 'Tue', sessions: 25 },
  { tenantId: 'tenant-1700000000000', day: 'Wed', sessions: 30 },
  { tenantId: 'tenant-1700000000000', day: 'Thu', sessions: 28 },
  { tenantId: 'tenant-1700000000000', day: 'Fri', sessions: 32 },
  { tenantId: 'tenant-1700000000000', day: 'Sat', sessions: 38 },
  { tenantId: 'tenant-1700000000000', day: 'Sun', sessions: 30 }
];

const AdminDashboard = () => {
  const { activeTenantId } = useTenant();
  const [filteredStats, setFilteredStats] = useState(allStats.filter(s => s.tenantId === activeTenantId));
  const [filteredRecentActivity, setFilteredRecentActivity] = useState(allRecentActivity.filter(a => a.tenantId === activeTenantId));
  const [filteredUserActivityData, setFilteredUserActivityData] = useState(allUserActivityData.filter(d => d.tenantId === activeTenantId));
  const [filteredDailySessionsData, setFilteredDailySessionsData] = useState(allDailySessionsData.filter(d => d.tenantId === activeTenantId));

  useEffect(() => {
    setFilteredStats(allStats.filter(s => s.tenantId === activeTenantId));
    setFilteredRecentActivity(allRecentActivity.filter(a => a.tenantId === activeTenantId));
    setFilteredUserActivityData(allUserActivityData.filter(d => d.tenantId === activeTenantId));
    setFilteredDailySessionsData(allDailySessionsData.filter(d => d.tenantId === activeTenantId));
  }, [activeTenantId]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Welcome to MyHotspot management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStats.map((stat) => (
            <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm ${stat.textColor} flex items-center`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">User Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredUserActivityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-color, #e0e0e0)" />
                  <XAxis dataKey="day" tick={{ fill: 'var(--chart-text-color, #6b7280)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--chart-text-color, #6b7280)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '0.5rem',
                      color: 'var(--tooltip-text)',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} name="Users" />
                  <Line type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} name="Sessions" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Daily Sessions</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredDailySessionsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-color, #e0e0e0)" />
                  <XAxis dataKey="day" tick={{ fill: 'var(--chart-text-color, #6b7280)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--chart-text-color, #6b7280)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '0.5rem',
                      color: 'var(--tooltip-text)',
                    }}
                    cursor={{fill: 'rgba(139, 92, 246, 0.1)'}}
                  />
                  <Bar dataKey="sessions" fill="#8b5cf6" name="Sessions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {filteredRecentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                <div className={`w-3 h-3 rounded-full ${activity.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-gray-100">{activity.user}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;