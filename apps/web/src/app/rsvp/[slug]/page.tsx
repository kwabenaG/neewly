'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Heart, CheckCircle, Phone, Music, Utensils } from 'lucide-react';
import { format } from 'date-fns';
import { useApi } from '@/hooks/useApi';
import { apiClient } from '@/lib/api';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string; // Backend returns eventDate, not date
  venue: string;
  venueAddress: string;
  bannerImage?: string;
  status: string; // Backend returns status, not isActive
  slug: string;
  isPublic: boolean;
  guestLimit: number;
  theme?: Record<string, unknown>; // More specific than any
  userId: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields that might be used in the UI
  startTime?: string;
  endTime?: string;
  coupleName?: string;
}

// Theme system for different event types
interface ThemeConfig {
  background: string;
  overlay: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  cardBg: string;
  iconBg: string;
  decorativeBg?: string;
  flowerPattern?: string;
}

const eventThemes: Record<string, ThemeConfig> = {
  wedding: {
    background: 'bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100',
    overlay: 'before:absolute before:inset-0 before:bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fdf2f8\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] before:opacity-30 before:backdrop-blur-sm',
    primary: 'from-rose-500 to-pink-600',
    secondary: 'from-pink-400 to-rose-500',
    accent: 'bg-rose-100 border-rose-200 text-rose-800',
    text: 'text-rose-900',
    cardBg: 'bg-white/95 backdrop-blur-md border-rose-200/60 shadow-xl',
    iconBg: 'bg-gradient-to-r from-rose-500 to-pink-600',
    decorativeBg: 'bg-gradient-to-br from-rose-200/20 via-pink-100/30 to-rose-200/20',
    flowerPattern: 'after:absolute after:inset-0 after:bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'flower\' x=\'0\' y=\'0\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Cg fill=\'%23fce7f3\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M50 20c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 30c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm-30-15c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5-4.5-2-4.5-4.5zm30 0c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5-4.5-2-4.5-4.5z\'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23flower)\'/%3E%3C/svg%3E")] after:opacity-40',
  },
  birthday: {
    background: 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50',
    overlay: 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-200/20 before:via-indigo-100/30 before:to-purple-100/40 before:backdrop-blur-sm',
    primary: 'from-blue-500 to-indigo-600',
    secondary: 'from-indigo-400 to-blue-500',
    accent: 'bg-blue-100 border-blue-200 text-blue-800',
    text: 'text-blue-900',
    cardBg: 'bg-white/90 backdrop-blur-sm border-blue-200/50',
    iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  },
  corporate: {
    background: 'bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-50',
    overlay: 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-slate-200/20 before:via-gray-100/30 before:to-zinc-100/40 before:backdrop-blur-sm',
    primary: 'from-slate-600 to-gray-700',
    secondary: 'from-gray-500 to-slate-600',
    accent: 'bg-slate-100 border-slate-200 text-slate-800',
    text: 'text-slate-900',
    cardBg: 'bg-white/90 backdrop-blur-sm border-slate-200/50',
    iconBg: 'bg-gradient-to-r from-slate-600 to-gray-700',
  },
  anniversary: {
    background: 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50',
    overlay: 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-amber-200/20 before:via-yellow-100/30 before:to-orange-100/40 before:backdrop-blur-sm',
    primary: 'from-amber-500 to-orange-600',
    secondary: 'from-orange-400 to-amber-500',
    accent: 'bg-amber-100 border-amber-200 text-amber-800',
    text: 'text-amber-900',
    cardBg: 'bg-white/90 backdrop-blur-sm border-amber-200/50',
    iconBg: 'bg-gradient-to-r from-amber-500 to-orange-600',
  },
  graduation: {
    background: 'bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-50',
    overlay: 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-emerald-200/20 before:via-teal-100/30 before:to-cyan-100/40 before:backdrop-blur-sm',
    primary: 'from-emerald-500 to-teal-600',
    secondary: 'from-teal-400 to-emerald-500',
    accent: 'bg-emerald-100 border-emerald-200 text-emerald-800',
    text: 'text-emerald-900',
    cardBg: 'bg-white/90 backdrop-blur-sm border-emerald-200/50',
    iconBg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
  },
  holiday: {
    background: 'bg-gradient-to-br from-red-100 via-orange-50 to-yellow-50',
    overlay: 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-red-200/20 before:via-orange-100/30 before:to-yellow-100/40 before:backdrop-blur-sm',
    primary: 'from-red-500 to-orange-600',
    secondary: 'from-orange-400 to-red-500',
    accent: 'bg-red-100 border-red-200 text-red-800',
    text: 'text-red-900',
    cardBg: 'bg-white/90 backdrop-blur-sm border-red-200/50',
    iconBg: 'bg-gradient-to-r from-red-500 to-orange-600',
  },
  default: {
    background: 'bg-gradient-to-br from-gray-100 via-slate-50 to-zinc-50',
    overlay: 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-200/20 before:via-slate-100/30 before:to-zinc-100/40 before:backdrop-blur-sm',
    primary: 'from-gray-600 to-slate-700',
    secondary: 'from-slate-500 to-gray-600',
    accent: 'bg-gray-100 border-gray-200 text-gray-800',
    text: 'text-gray-900',
    cardBg: 'bg-white/90 backdrop-blur-sm border-gray-200/50',
    iconBg: 'bg-gradient-to-r from-gray-600 to-slate-700',
  },
};

function detectEventType(event: Event): string {
  const title = event.title.toLowerCase();
  const description = event.description?.toLowerCase() || '';
  const coupleName = event.coupleName?.toLowerCase() || '';

  if (title.includes('wedding') || description.includes('wedding') || coupleName.includes('wedding') ||
      title.includes('marry') || description.includes('marry') || coupleName.includes('marry') ||
      title.includes('ceremony') || description.includes('ceremony')) {
    return 'wedding';
  }
  
  if (title.includes('birthday') || description.includes('birthday') ||
      title.includes('birth day') || description.includes('birth day')) {
    return 'birthday';
  }
  
  if (title.includes('corporate') || description.includes('corporate') ||
      title.includes('business') || description.includes('business') ||
      title.includes('meeting') || description.includes('meeting')) {
    return 'corporate';
  }
  
  if (title.includes('anniversary') || description.includes('anniversary') ||
      title.includes('anniversary') || description.includes('anniversary')) {
    return 'anniversary';
  }
  
  if (title.includes('graduation') || description.includes('graduation') ||
      title.includes('graduate') || description.includes('graduate')) {
    return 'graduation';
  }
  
  if (title.includes('holiday') || description.includes('holiday') ||
      title.includes('christmas') || description.includes('christmas') ||
      title.includes('new year') || description.includes('new year')) {
    return 'holiday';
  }
  
  return 'default';
}

const rsvpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().optional(),
  attending: z.enum(['yes', 'no']),
  numberOfGuests: z.number().min(1, 'Please specify number of guests').max(10, 'Maximum 10 guests allowed'),
  mealPreference: z.enum(['meat', 'vegetarian', 'vegan', 'gluten-free', 'no-preference']),
  songRequest: z.string().optional(),
  message: z.string().max(500, 'Message must be 500 characters or less').optional(),
});

type RsvpForm = z.infer<typeof rsvpSchema>;

export default function RsvpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [existingRsvp, setExistingRsvp] = useState<{ id: string; name: string; email: string; status: string } | null>(null);
  const { toast } = useToast();
  const api = useApi();

  // Helper function to generate calendar URL
  const generateCalendarUrl = (event: Event, rsvpData: RsvpForm): string => {
    const startDate = new Date(`${event.eventDate}T${event.startTime || '18:00'}`);
    const endDate = new Date(`${event.eventDate}T${event.endTime || '22:00'}`);
    
    const params = new URLSearchParams({
      text: event.title,
      dates: `${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
      details: `${event.description || ''}\n\nVenue: ${event.venue || 'TBD'}\nAddress: ${event.venueAddress || ''}`,
      location: event.venueAddress || event.venue || '',
    });
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RsvpForm>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      attending: 'yes',
      numberOfGuests: 1,
      mealPreference: 'no-preference',
      songRequest: '',
      message: '',
    },
  });

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getPublicEvent(slug);
      if (response.success && response.data) {
        const eventData = response.data as Event;
        setEvent(eventData);
        
        if (!eventData.isPublic) {
          setError('This event is not public');
        }
      } else {
        setError('Event not found or no longer available');
      }
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const onSubmit = async (values: RsvpForm) => {
    if (!event) return;

    try {
      setSubmitted(true);
      
      const submissionData = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        status: values.attending === 'yes' ? 'confirmed' : 'declined',
        numberOfGuests: values.numberOfGuests,
        mealPreference: values.mealPreference,
        songRequest: values.songRequest,
        message: values.message,
        eventId: event.id,
      };

      const response = await apiClient.submitRSVP(submissionData);
      
      if (response.success) {
        toast({
          title: 'RSVP Submitted Successfully!',
          description: `Thank you for your response, ${values.name}!`,
        });
        
        // Reset form
        reset();
        setSubmitted(true);
      } else {
        throw new Error(response.error || 'Failed to submit RSVP');
      }
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      setError('Failed to submit RSVP. Please try again.');
      setSubmitted(false);
    }
  };

  const handleAttendingChange = (value: 'yes' | 'no') => {
    setValue('attending', value);
    if (value === 'no') {
      setValue('numberOfGuests', 0);
      setValue('mealPreference', 'no-preference');
    } else {
      setValue('numberOfGuests', 1);
    }
  };

  if (loading) {
    return (
      <div className={`${eventThemes.default.background} min-h-screen py-12 px-6`}>
        <div className={`${eventThemes.default.overlay} relative`}>
          <div className="max-w-4xl mx-auto">
            <Card className={`${eventThemes.default.cardBg} animate-pulse`}>
              <CardHeader className="text-center px-8 pb-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${eventThemes.default.background} min-h-screen py-12 px-6`}>
        <div className={`${eventThemes.default.overlay} relative`}>
          <div className="max-w-4xl mx-auto">
            <Card className={`${eventThemes.default.cardBg}`}>
              <CardHeader className="text-center px-8 pb-6">
                <h1 className="text-3xl font-bold text-red-600">Error</h1>
              </CardHeader>
              <CardContent className="text-center px-8 pb-8">
                <p className="text-gray-700 mb-6 text-lg">{error}</p>
                <Button onClick={fetchEvent} variant="outline" className="px-6 py-2">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!event || !event.isPublic) {
    return (
      <div className={`${eventThemes.default.background} min-h-screen py-12 px-6`}>
        <div className={`${eventThemes.default.overlay} relative`}>
          <div className="max-w-4xl mx-auto">
            <Card className={`${eventThemes.default.cardBg}`}>
              <CardHeader className="text-center px-8 pb-6">
                <h1 className="text-3xl font-bold text-gray-900">Event Not Available</h1>
              </CardHeader>
              <CardContent className="text-center px-8 pb-8">
                <p className="text-gray-700 text-lg">This event is not public or no longer available.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={`${eventThemes.default.background} min-h-screen py-12 px-6`}>
        <div className={`${eventThemes.default.overlay} relative`}>
          <div className="max-w-4xl mx-auto">
            <Card className={`${eventThemes.default.cardBg}`}>
              <CardHeader className="text-center px-8 pb-6">
                <div className="flex items-center justify-center mb-6">
                  <CheckCircle className="h-20 w-20 text-green-500" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Thank You!</h1>
                <p className="text-gray-600 text-lg">Your RSVP has been submitted successfully.</p>
              </CardHeader>
              <CardContent className="text-center space-y-6 px-8 pb-8">
                <p className="text-gray-700 text-lg">
                  We&apos;re excited to celebrate with you! You&apos;ll receive a confirmation email shortly.
                </p>
                
                                <div className="space-y-4">
                  <Button 
                    asChild 
                    className="w-full max-w-md mx-auto"
                    onClick={() => window.open(generateCalendarUrl(event, {} as RsvpForm), '_blank')}
                  >
                    <a href={generateCalendarUrl(event, {} as RsvpForm)} target="_blank" rel="noopener noreferrer">
                      <Calendar className="h-4 w-4 mr-2" />
                        Add to Calendar
                      </a>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full max-w-md mx-auto"
                    onClick={() => {
                      setSubmitted(false);
                      reset();
                    }}
                  >
                    Submit Another RSVP
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const eventType = detectEventType(event);
  const theme = eventThemes[eventType] || eventThemes.default;

  return (
    <div className={`${theme.background} min-h-screen py-12 px-6 relative overflow-hidden`}>
      {/* Flower pattern background */}
      <div className={`absolute inset-0 ${theme.flowerPattern || ''} opacity-20`}></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Top left flower */}
        <div className="absolute top-8 left-8 w-16 h-16 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-rose-200 to-pink-300 rounded-full blur-sm"></div>
        </div>
        
        {/* Top right flower */}
        <div className="absolute top-12 right-12 w-20 h-20 opacity-25">
          <div className="w-full h-full bg-gradient-to-br from-pink-200 to-rose-300 rounded-full blur-sm"></div>
        </div>
        
        {/* Center top flower */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-14 h-14 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-rose-300 to-pink-400 rounded-full blur-sm"></div>
        </div>
        
        {/* Center left flower */}
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 w-12 h-12 opacity-25">
          <div className="w-full h-full bg-gradient-to-br from-pink-300 to-rose-400 rounded-full blur-sm"></div>
        </div>
        
        {/* Center right flower */}
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-16 h-16 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-rose-200 to-pink-300 rounded-full blur-sm"></div>
        </div>
        
        {/* Bottom left flower */}
        <div className="absolute bottom-16 left-16 w-12 h-12 opacity-35">
          <div className="w-full h-full bg-gradient-to-br from-rose-300 to-pink-400 rounded-full blur-sm"></div>
        </div>
        
        {/* Bottom right flower */}
        <div className="absolute bottom-20 right-20 w-16 h-16 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-pink-300 to-rose-400 rounded-full blur-sm"></div>
        </div>
        
        {/* Center bottom flower */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-10 h-10 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-pink-200 to-rose-300 rounded-full blur-sm"></div>
        </div>
      </div>
      
      <div className={`${theme.overlay} relative z-10`}>
        <div className="max-w-4xl mx-auto">
          {/* Event Header */}
          <Card className={`mb-8 ${theme.cardBg} relative overflow-hidden`}>
            {/* Floral corner decorations */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-rose-200 to-pink-300 rounded-full blur-sm"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-20 h-20 opacity-25">
              <div className="w-full h-full bg-gradient-to-br from-pink-200 to-rose-300 rounded-full blur-sm"></div>
            </div>
            
            <CardHeader className="text-center pb-6 px-8 relative z-10">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${theme.iconBg} rounded-lg flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-xl">💒</span>
                </div>
                <span className={`text-3xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                  Newly
                </span>
              </div>
              
              {/* Wedding-specific decorative elements */}
              {eventType === 'wedding' && (
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-300 to-pink-400 rounded-full opacity-60"></div>
                  <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full opacity-80"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full opacity-70"></div>
                  <div className="w-4 h-4 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full opacity-60"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-300 to-pink-400 rounded-full opacity-60"></div>
                </div>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              {event.coupleName && (
                <p className="text-xl text-gray-600 mb-4">You&apos;re invited to celebrate with {event.coupleName}</p>
              )}
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(event.eventDate), 'EEEE, MMMM dd, yyyy')}
                </div>
                {event.startTime && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {event.startTime}
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.venue}
                  </div>
                )}
              </div>
              
              {/* Enhanced countdown timer with floral styling */}
              {(() => {
                const eventDate = new Date(event.eventDate);
                const now = new Date();
                const timeDiff = eventDate.getTime() - now.getTime();
                const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                
                if (daysLeft > 0 && daysLeft <= 30) {
                  return (
                    <div className={`mt-4 p-4 ${theme.accent} rounded-lg relative overflow-hidden`}>
                      {/* Floral background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23be185d\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M20 10c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm0 20c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm-15-10c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5-4.5-2-4.5-4.5zm30 0c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-1 2.5-2.5 2.5-2.5-1-2.5-2.5z\'/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                      </div>
                      <p className={`text-sm font-medium text-center relative z-10`}>
                        🌸 {daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days`} until the big day! 🌸
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
            </CardHeader>
            
            {event.description && (
              <CardContent className="pt-0 px-8 pb-6">
                <p className="text-gray-700 text-center">{event.description}</p>
              </CardContent>
            )}
          </Card>

          {/* RSVP Form */}
          <Card className={`${theme.cardBg} backdrop-blur-sm border-${theme.accent.replace('-', '')}-200/50 relative overflow-hidden mt-12`}>
            {/* Floral corner decorations for RSVP form */}
            <div className="absolute top-0 left-0 w-16 h-16 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-rose-200 to-pink-300 rounded-full blur-sm"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-25">
              <div className="w-full h-full bg-gradient-to-br from-pink-200 to-rose-300 rounded-full blur-sm"></div>
            </div>
            
            <CardHeader className="relative z-10 px-8 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center">RSVP</h2>
              <p className="text-gray-600 text-center">Please let us know if you&apos;ll be attending</p>
              
              {/* Enhanced progress indicator with floral styling */}
              <div className="flex items-center justify-center space-x-2 mt-4">
                <div className={`w-3 h-3 bg-gradient-to-r ${theme.primary} rounded-full shadow-sm`}></div>
                <div className={`w-3 h-3 bg-gradient-to-r ${theme.secondary} rounded-full opacity-70 shadow-sm`}></div>
                <div className={`w-3 h-3 bg-gradient-to-r ${theme.secondary} rounded-full opacity-40 shadow-sm`}></div>
              </div>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">Full Name *</Label>
                    <div className="relative">
                      <Input 
                        id="name" 
                        placeholder="Enter your full name" 
                        {...register('name')} 
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className="border-rose-200 focus:border-rose-400 focus:ring-rose-400/20 transition-colors"
                      />
                      {/* Decorative flower icon */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 bg-gradient-to-r from-rose-300 to-pink-400 rounded-full opacity-60"></div>
                      </div>
                    </div>
                    {errors.name && (
                      <p id="name-error" className="text-xs text-red-600" role="alert">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                    <div className="relative">
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email address" 
                        {...register('email')} 
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className="border-rose-200 focus:border-rose-400 focus:ring-rose-400/20 transition-colors"
                      />
                      {/* Decorative flower icon */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-3 h-3 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full opacity-70"></div>
                      </div>
                    </div>
                    {errors.email && (
                      <p id="email-error" className="text-xs text-red-600" role="alert">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      id="phoneNumber" 
                      placeholder="Enter your phone number" 
                      {...register('phoneNumber')} 
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500">We&apos;ll only use this for urgent event updates</p>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Will you be attending? *</Label>
                  <div className="flex space-x-6">
                    <Button
                      type="button"
                      variant={watch('attending') === 'yes' ? 'default' : 'outline'}
                      onClick={() => handleAttendingChange('yes')}
                      className="flex-1"
                      aria-pressed={watch('attending') === 'yes'}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Yes, I&apos;ll be there!
                    </Button>
                    <Button
                      type="button"
                      variant={watch('attending') === 'no' ? 'default' : 'outline'}
                      onClick={() => handleAttendingChange('no')}
                      className="flex-1"
                      aria-pressed={watch('attending') === 'no'}
                    >
                      Sorry, I can&apos;t make it
                    </Button>
                  </div>
                </div>

                {watch('attending') === 'yes' && (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="numberOfGuests">Number of Guests *</Label>
                      <Select 
                        value={watch('numberOfGuests')?.toString()} 
                        onValueChange={(value) => setValue('numberOfGuests', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.numberOfGuests && (
                        <p className="text-xs text-red-600" role="alert">
                          {errors.numberOfGuests.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="mealPreference">Meal Preference *</Label>
                      <Select 
                        value={watch('mealPreference')} 
                        onValueChange={(value) => setValue('mealPreference', value as 'meat' | 'vegetarian' | 'vegan' | 'gluten-free' | 'no-preference')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your meal preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meat">🍖 Meat</SelectItem>
                          <SelectItem value="vegetarian">🥬 Vegetarian</SelectItem>
                          <SelectItem value="vegan">🌱 Vegan</SelectItem>
                          <SelectItem value="gluten-free">🌾 Gluten-Free</SelectItem>
                          <SelectItem value="no-preference">🤷 No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.mealPreference && (
                        <p className="text-xs text-red-600" role="alert">
                          {errors.mealPreference.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="songRequest">Song Request (Optional)</Label>
                      <div className="relative">
                        <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          id="songRequest" 
                          placeholder="What song will get you on the dance floor?" 
                          {...register('songRequest')} 
                          className="pl-10"
                          maxLength={100}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Help us create the perfect playlist! 
                        {watch('songRequest') && (
                          <span className="ml-2 text-gray-400">
                            {watch('songRequest')?.length || 0}/100 characters
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="message">Message to the Couple (Optional)</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Share your excitement, well wishes, or any special requests..." 
                        rows={3} 
                        {...register('message')} 
                        aria-describedby={errors.message ? 'message-error' : undefined}
                      />
                      {errors.message && (
                        <p id="message-error" className="text-xs text-red-600" role="alert">
                          {errors.message.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {watch('message')?.length || 0}/500 characters
                      </p>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full max-w-md mx-auto bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" 
                  disabled={isSubmitting}
                  aria-describedby="submit-status"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🌸</span>
                      Submit RSVP
                      <span className="ml-2">🌸</span>
                    </>
                  )}
                </Button>
                
                <div id="submit-status" className="sr-only" aria-live="polite">
                  {isSubmitting ? 'Submitting your RSVP...' : 'Ready to submit'}
                </div>
              </form>
              
              {/* Helpful tips */}
              <div className="mt-8 p-6 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg relative overflow-hidden">
                {/* Floral background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23be185d\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M30 15c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5zm0 25c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5zm-20-12.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5-1.5 3.5-3.5 3.5-3.5-1.5-3.5-3.5zm40 0c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5-1.5 3.5-3.5 3.5-3.5-1.5-3.5-3.5z\'/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                </div>
                
                <h3 className="font-medium text-rose-900 mb-2 relative z-10">�� Helpful Tips</h3>
                <ul className="text-sm text-rose-700 space-y-1 relative z-10">
                  <li>• Your RSVP helps us plan the perfect celebration</li>
                  <li>• You can update your response anytime before the event</li>
                  <li>• Feel free to add a personal message to the couple</li>
                  <li>• Don&apos;t forget to add the event to your calendar!</li>
                </ul>
                
                {/* Decorative corner flowers */}
                <div className="absolute top-2 right-2 w-8 h-8 opacity-30">
                  <div className="w-full h-full bg-gradient-to-br from-rose-300 to-pink-400 rounded-full blur-sm"></div>
                </div>
                <div className="absolute bottom-2 left-2 w-6 h-6 opacity-25">
                  <div className="w-full h-full bg-gradient-to-br from-pink-300 to-rose-400 rounded-full blur-sm"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 