'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';
import { CreateEventDialog } from '@/components/events/create-event-dialog';

// Mock data - will be replaced with real API calls
const recentEvents = [
  {
    id: '1',
    title: "Sarah & Michael's Wedding",
    date: "June 15, 2024",
    venue: "Grand Hotel, NYC",
    status: "active",
    guests: 85,
    confirmed: 62,
    declined: 8,
    pending: 15,
    slug: "sarah-michael-wedding",
  },
  {
    id: '2',
    title: "Jessica & David's Reception",
    date: "July 20, 2024",
    venue: "Beach Resort, LA",
    status: "draft",
    guests: 120,
    confirmed: 0,
    declined: 0,
    pending: 120,
    slug: "jessica-david-reception",
  },
  {
    id: '3',
    title: "Corporate Holiday Party",
    date: "December 15, 2024",
    venue: "Downtown Conference Center",
    status: "active",
    guests: 200,
    confirmed: 145,
    declined: 25,
    pending: 30,
    slug: "corporate-holiday-party",
  },
];

export function RecentEvents() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>
              Your latest RSVP pages and their status
            </CardDescription>
          </div>
          <Link href="/dashboard/events">
            <Button variant="outline" size="sm">
              View All Events
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentEvents.map((event) => (
          <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold">{event.title}</h3>
                <Badge 
                  variant={event.status === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {event.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {event.date}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.venue}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {event.guests} guests
                </div>
              </div>
              {event.status === 'active' && (
                <div className="flex items-center space-x-4 mt-2 text-xs">
                  <span className="text-green-600">{event.confirmed} confirmed</span>
                  <span className="text-red-600">{event.declined} declined</span>
                  <span className="text-yellow-600">{event.pending} pending</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Link href={`/dashboard/events/${event.id}`}>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </Link>
              {event.status === 'active' && (
                <Link href={`/rsvp/${event.slug}`} target="_blank">
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Event
          </Button>
        </div>
      </CardContent>

      {/* Create Event Dialog */}
      <CreateEventDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </Card>
  );
} 