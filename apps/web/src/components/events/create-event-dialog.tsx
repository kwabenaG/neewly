'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const createEventSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().max(1000).optional().or(z.literal('')),
  date: z.date({ message: 'Event date is required' }),
  venue: z.string().max(255).optional().or(z.literal('')),
  venueAddress: z.string().max(255).optional().or(z.literal('')),
  startTime: z.string().regex(/^$|^\d{2}:\d{2}$/g, 'Use HH:MM').optional().or(z.literal('')),
  endTime: z.string().regex(/^$|^\d{2}:\d{2}$/g, 'Use HH:MM').optional().or(z.literal('')),
  isPublic: z.boolean().default(true),
});

type CreateEventValues = z.infer<typeof createEventSchema>;

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: undefined as unknown as Date,
      venue: '',
      venueAddress: '',
      startTime: '',
      endTime: '',
      isPublic: true,
    },
  });

  const selectedDate = watch('date');

  const onSubmit = async (values: CreateEventValues) => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) {
        console.error('No authentication token available');
        return;
      }

      // Validate required fields
      if (!values.title || !values.date) {
        console.error('Missing required fields:', { title: values.title, date: values.date });
        return;
      }

      // Ensure slug is never empty and has a fallback
      let slug = values.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      // Fallback if slug is empty or just hyphens
      if (!slug || slug === '-' || slug === '--') {
        slug = `event-${Date.now()}`;
      }

      // Ensure slug starts with a letter or number
      if (!/^[a-z0-9]/.test(slug)) {
        slug = `event-${slug}`;
      }

      // Create event data with all fields as strings
      const eventData = {
        title: `${values.title.trim()}`,
        eventDate: values.date.toISOString().split('.')[0]+'Z', // Format: YYYY-MM-DDTHH:mm:ssZ
        slug: `${slug}`,
        description: `${values.description?.trim() || ''}`,
        venue: `${values.venue?.trim() || ''}`,
        venueAddress: `${values.venueAddress?.trim() || ''}`,
        isPublic: true,
        guestLimit: 50,
      };

      // Log the data before sending
      console.log('Form values:', values);
      console.log('Generated slug:', slug);
      console.log('Event data to send:', eventData);

      console.log('Sending event data:', eventData);
      console.log('Date value:', values.date);
      console.log('Date ISO string:', values.date.toISOString());
      console.log('Title:', values.title);
      console.log('Slug:', slug);

      const response = await apiClient.createEvent(token, eventData);

      if (response.success) {
        reset();
        onOpenChange(false);
      } else {
        console.error('Error creating event:', response.error);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input id="title" placeholder="e.g., Sarah & Michael's Wedding" {...register('title')} />
              {errors.title && (
                <p className="text-xs text-red-600">{errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" placeholder="e.g., Grand Hotel" {...register('venue')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Tell your guests about your special day..." rows={3} {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Event Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setValue('date', date, { shouldValidate: true })}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-xs text-red-600">{errors.date.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="venueAddress">Venue Address</Label>
              <Input id="venueAddress" placeholder="123 Main St, City, State" {...register('venueAddress')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" type="time" {...register('startTime')} />
              {errors.startTime && (
                <p className="text-xs text-red-600">{errors.startTime.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" {...register('endTime')} />
              {errors.endTime && (
                <p className="text-xs text-red-600">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={watch('isPublic')}
              onCheckedChange={(checked) => setValue('isPublic', checked)}
            />
            <Label htmlFor="isPublic">Make event public (allow RSVP without login)</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 