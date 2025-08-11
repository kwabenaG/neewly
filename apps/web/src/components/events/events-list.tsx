'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  Users, 
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, isValid } from 'date-fns';
import { apiClient } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { CreateEventDialog } from '@/components/events/create-event-dialog';

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
  createdAt: string;
  updatedAt: string;
}

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { getToken } = useAuth();

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error('No authentication token available');
        return;
      }
      
      const response = await apiClient.getEvents(token);
      if (response.success && response.data && Array.isArray(response.data)) {
        setEvents(response.data as Event[]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyRsvpLink = async (slug: string) => {
    const link = `${window.location.origin}/rsvp/${slug}`;
    try {
      await navigator.clipboard.writeText(link);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        console.error('No authentication token available');
        return;
      }
      
      const response = await apiClient.deleteEvent(token, eventId);
      if (response.success) {
        setEvents(events.filter(event => event.id !== eventId));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <>
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600 mb-4">Create your first event to get started with managing RSVPs.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Create Your First Event</Button>
          </CardContent>
        </Card>

        <CreateEventDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold truncate">
                  {event.title}
                </CardTitle>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatEventDate(event.date)}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => copyRsvpLink(event.slug)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy RSVP Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(`/rsvp/${event.slug}`, '_blank')}>
                      <Eye className="h-4 w-4 mr-2" />
                      View RSVP Page
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = `/dashboard/events/${event.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Manage Event
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {event.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {event.description}
              </p>
            )}
            
            {event.venue && (
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{event.venue}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <Badge variant={event.isActive ? "default" : "secondary"}>
                {event.isActive ? "Active" : "Inactive"}
              </Badge>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyRsvpLink(event.slug)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/rsvp/${event.slug}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>

      <CreateEventDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
} 