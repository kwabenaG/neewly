'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Copy, 
  ExternalLink,
  Settings,
  Edit,
  Eye,
  BarChart3,
  Mail,
  QrCode
} from 'lucide-react';
import { format, isValid } from 'date-fns';
import { apiClient } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { RsvpFormBuilder } from '@/components/events/rsvp-form-builder';
import { EventGuests } from '@/components/events/event-guests';
import { EventAnalytics } from '@/components/events/event-analytics';
import { EventSettings } from '@/components/events/event-settings';
import { EventSkeleton } from '@/components/events/event-skeleton';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  venueAddress: string;
  startTime: string;
  endTime: string;
  slug: string;
  isActive: boolean;
  coupleName?: string;
  bannerImage?: string;
  guestLimit: number;
  theme?: any;
}

export default function EventPage() {
  const params = useParams();
  const { getToken } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');



  // Helper function to safely format dates
  const formatEventDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Date not set';
    
    const date = new Date(dateString);
    if (!isValid(date)) return 'Invalid date';
    
    try {
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Date error';
    }
  };


  const fetchEvent = useCallback(
    async () => {
      try {
        const token = await getToken();
        if (!token) return;
        
        const response = await apiClient.getEvent(token, params.id as string);
        if (response.success && response.data) {
          setEvent(response.data as Event);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    }, [params.id, getToken]
  )
  
  


  // Fetch event when the page loads
  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);


  const copyRsvpLink = async () => {

    
    if (!event) return;
    
    const link = `${window.location.origin}/rsvp/${event.slug}`;
    try {
      await navigator.clipboard.writeText(link);
      // Add toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  if (loading) {
    return <EventSkeleton />;
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
            <p className="text-gray-600">This event could not be found or you don't have permission to view it.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <p className="text-gray-600 mt-1">Manage your event and RSVP responses</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={copyRsvpLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copy RSVP Link
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open(`/rsvp/${event.slug}`, '_blank')}
          >
            <Eye className="h-4 w-4 mr-2" />
            View RSVP Page
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Event
          </Button>
        </div>
      </div>

      {/* Event Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Event Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatEventDate(event.date)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {event.startTime || 'TBD'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Venue</p>
                <p className="text-lg font-semibold text-gray-900">
                  {event.venue || 'TBD'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Guest Limit</p>
                <p className="text-lg font-semibold text-gray-900">
                  {event.guestLimit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="form-builder" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>RSVP Form</span>
          </TabsTrigger>
          <TabsTrigger value="guests" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Guests</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">📅</span>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Event Details
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base mt-1">
                      Key information about your event
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  {event.description && (
                    <p className="text-gray-600 mt-1">{event.description}</p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                    {formatEventDate(event.date)}
                    </span>
                  </div>
                  
                  {event.startTime && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {event.startTime} {event.endTime && `- ${event.endTime}`}
                      </span>
                    </div>
                  )}
                  
                  {event.venue && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{event.venue}</span>
                    </div>
                  )}
                  
                  {event.venueAddress && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{event.venueAddress}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">⚡</span>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      Quick Actions
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base mt-1">
                      Essential tools for your event
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-0">
                <div className="mb-5">
                  <Button 
                    className="w-full h-14 justify-start px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]" 
                    onClick={copyRsvpLink}
                  >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                    <Copy className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-white">Copy RSVP Link</span>
                    <span className="text-sm text-pink-100">Share with your guests</span>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-medium">Share</span>
                  </div>
                </Button>
                </div>
                
                <div className="mb-5">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 justify-start px-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-gray-800 group-hover:text-gray-900">Send Invitations</span>
                    <span className="text-sm text-gray-600 group-hover:text-gray-700">Email your guest list</span>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Email</span>
                  </div>
                </Button>
                </div>
                
                <div className="mb-5">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 justify-start px-6 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                    <QrCode className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-gray-800 group-hover:text-gray-900">Generate QR Code</span>
                    <span className="text-sm text-gray-600 group-hover:text-gray-700">For printed materials</span>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Print</span>
                  </div>
                </Button>
                </div>
                
                <div className="mb-5">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 justify-start px-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-gray-800 group-hover:text-gray-900">Preview RSVP Page</span>
                      <span className="text-sm text-gray-600 group-hover:text-gray-700">See how guests will view it</span>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Preview</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="form-builder">
          <RsvpFormBuilder eventId={event.id} />
        </TabsContent>

        <TabsContent value="guests">
          <EventGuests eventId={event.id} />
        </TabsContent>

        <TabsContent value="analytics">
          <EventAnalytics eventId={event.id} />
        </TabsContent>

        <TabsContent value="settings">
          <EventSettings event={event} onUpdate={fetchEvent} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 