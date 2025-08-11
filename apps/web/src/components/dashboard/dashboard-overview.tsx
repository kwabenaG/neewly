'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { CreateEventDialog } from '@/components/events/create-event-dialog';

export function DashboardOverview() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-pink-500 via-purple-500 to-purple-600 text-white shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="relative">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-2xl">🎉</span>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-white">Welcome to Newly!</CardTitle>
                <CardDescription className="text-pink-100 text-lg mt-2">
                  Create beautiful RSVP pages and manage your events with ease.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-pink-100 text-lg leading-relaxed">
                Ready to create your next beautiful RSVP page? Get started by creating a new event and delight your guests with our world-class RSVP experience.
              </p>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/events/create">
                  <Button className="bg-white text-pink-600 hover:bg-gray-50 hover:scale-105 transition-all duration-200 font-semibold px-8 py-4 shadow-lg text-base">
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Event
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 text-pink-100">
                  <span className="text-sm">✨</span>
                  <span className="text-sm font-medium">World-class RSVP platform</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Quick Actions */}
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
                Jump into the most common tasks to get you started
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <Link href="/dashboard/guests" className="block">
            <Button 
              variant="outline" 
              className="w-full justify-start h-14 px-6 text-left hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-200 transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-800 group-hover:text-gray-900">Manage Guest List</span>
                <span className="text-sm text-gray-600 group-hover:text-gray-700">View, add, and organize your guest lists with ease</span>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Popular</span>
              </div>
            </Button>
          </Link>
          
          <Link href="/dashboard/analytics" className="block">
            <Button 
              variant="outline" 
              className="w-full justify-start h-14 px-6 text-left hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-200 transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-800 group-hover:text-gray-900">View RSVP Analytics</span>
                <span className="text-sm text-gray-600 group-hover:text-gray-700">Track response rates, trends, and guest insights</span>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Insights</span>
              </div>
            </Button>
          </Link>
          
          <Link href="/dashboard/events" className="block">
            <Button 
              variant="outline" 
              className="w-full justify-start h-14 px-6 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-200 transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-800 group-hover:text-gray-900">Manage Events</span>
                <span className="text-sm text-gray-600 group-hover:text-gray-700">Create, edit, and organize your beautiful events</span>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Core</span>
              </div>
            </Button>
          </Link>
          
          {/* Additional Quick Action */}
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full justify-start h-14 px-6 text-left bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-white">Create New Event</span>
              <span className="text-sm text-pink-100">Start building your next beautiful RSVP page</span>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-medium">New</span>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Create Event Dialog */}
      <CreateEventDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
} 