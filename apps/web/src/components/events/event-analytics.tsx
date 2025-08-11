'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Calendar,
  Mail,
  Utensils,
  Music
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

interface EventAnalyticsData {
  eventId: string;
  eventName: string;
  totalGuests: number;
  confirmed: number;
  declined: number;
  pending: number;
  responseRate: number;
  mealPreferences: Array<{
    preference: string;
    count: number;
  }>;
  songRequests: Array<{
    song: string;
    count: number;
  }>;
  dailyResponses: Array<{
    date: string;
    confirmed: number;
    declined: number;
    pending: number;
  }>;
}

interface EventAnalyticsProps {
  eventId: string;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export function EventAnalytics({ eventId }: EventAnalyticsProps) {
  const { getToken } = useAuth();
  const [data, setData] = useState<EventAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventAnalytics();
  }, [eventId]);

  const fetchEventAnalytics = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      
      const response = await apiClient.getEventAnalytics(token, eventId);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        // Mock data for development
        setData({
          eventId,
          eventName: "Sarah & Michael's Wedding",
          totalGuests: 150,
          confirmed: 89,
          declined: 23,
          pending: 38,
          responseRate: 74.7,
          mealPreferences: [
            { preference: 'No Preference', count: 45 },
            { preference: 'Vegetarian', count: 32 },
            { preference: 'Vegan', count: 18 },
            { preference: 'Gluten-Free', count: 15 },
          ],
          songRequests: [
            { song: 'Uptown Funk', count: 8 },
            { song: 'Sweet Caroline', count: 6 },
            { song: 'Don\'t Stop Believin\'', count: 5 },
            { song: 'I Gotta Feeling', count: 4 },
          ],
          dailyResponses: [
            { date: '2024-01-01', confirmed: 5, declined: 1, pending: 3 },
            { date: '2024-01-02', confirmed: 8, declined: 2, pending: 2 },
            { date: '2024-01-03', confirmed: 12, declined: 3, pending: 1 },
            { date: '2024-01-04', confirmed: 15, declined: 4, pending: 5 },
            { date: '2024-01-05', confirmed: 20, declined: 6, pending: 8 },
            { date: '2024-01-06', confirmed: 18, declined: 5, pending: 12 },
            { date: '2024-01-07', confirmed: 11, declined: 2, pending: 7 },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching event analytics:', error);
      // Mock data for development
      setData({
        eventId,
        eventName: "Sarah & Michael's Wedding",
        totalGuests: 150,
        confirmed: 89,
        declined: 23,
        pending: 38,
        responseRate: 74.7,
        mealPreferences: [
          { preference: 'No Preference', count: 45 },
          { preference: 'Vegetarian', count: 32 },
          { preference: 'Vegan', count: 18 },
          { preference: 'Gluten-Free', count: 15 },
        ],
        songRequests: [
          { song: 'Uptown Funk', count: 8 },
          { song: 'Sweet Caroline', count: 6 },
          { song: 'Don\'t Stop Believin\'', count: 5 },
          { song: 'I Gotta Feeling', count: 4 },
        ],
        dailyResponses: [
          { date: '2024-01-01', confirmed: 5, declined: 1, pending: 3 },
          { date: '2024-01-02', confirmed: 8, declined: 2, pending: 2 },
          { date: '2024-01-03', confirmed: 12, declined: 3, pending: 1 },
          { date: '2024-01-04', confirmed: 15, declined: 4, pending: 5 },
          { date: '2024-01-05', confirmed: 20, declined: 6, pending: 8 },
          { date: '2024-01-06', confirmed: 18, declined: 5, pending: 12 },
          { date: '2024-01-07', confirmed: 11, declined: 2, pending: 7 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-600">No analytics data available for this event</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pieData = [
    { name: 'Confirmed', value: data.confirmed, color: '#10b981' },
    { name: 'Declined', value: data.declined, color: '#ef4444' },
    { name: 'Pending', value: data.pending, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Guests</p>
                <p className="text-2xl font-bold text-gray-900">{data.totalGuests}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-green-600">{data.responseRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{data.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{data.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSVP Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>RSVP Distribution</CardTitle>
          </CardHeader>
          <CardContent>
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
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Confirmed ({data.confirmed})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Declined ({data.declined})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Pending ({data.pending})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Responses Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Response Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.dailyResponses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="confirmed" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="declined" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Utensils className="h-5 w-5" />
              <span>Meal Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.mealPreferences}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="preference" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Song Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Music className="h-5 w-5" />
              <span>Top Song Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.songRequests.map((song, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{song.song}</h4>
                    <p className="text-sm text-gray-600">{song.count} requests</p>
                  </div>
                  <Badge variant="outline">{index + 1}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 