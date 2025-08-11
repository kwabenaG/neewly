'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface AddGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId?: string; // required to associate guest with event
}

export function AddGuestDialog({ open, onOpenChange, eventId }: AddGuestDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const schema = z.object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Valid email required'),
    phoneNumber: z.string().optional().or(z.literal('')),
    numberOfGuests: z.coerce.number().min(1).max(6),
    mealPreference: z.string().optional().or(z.literal('')),
    message: z.string().max(1000).optional().or(z.literal('')),
    status: z.enum(['invited', 'confirmed', 'declined', 'pending']).optional().default('pending'),
  });

  type FormValues = z.infer<typeof schema>;

  const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      numberOfGuests: 1,
      mealPreference: '',
      message: '',
      status: 'pending',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      const token = await getToken();
      if (!token) {
        console.error('No authentication token available');
        return;
      }
      
      const response = await apiClient.createGuest(token, { ...values, eventId });
      
      if (response.success) {
        reset();
        onOpenChange(false);
      } else {
        setSubmitError(response.error || 'Failed to add guest');
      }
    } catch (error) {
      console.error('Error adding guest:', error);
      setSubmitError('Failed to add guest');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="John Doe" {...register('name')} />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" placeholder="john@example.com" {...register('email')} />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" type="tel" placeholder="+1 (555) 123-4567" {...register('phoneNumber')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numberOfGuests">Number of Guests</Label>
              <Controller
                control={control}
                name="numberOfGuests"
                render={({ field }) => (
                  <Select value={String(field.value)} onValueChange={(v) => field.onChange(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'guest' : 'guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.numberOfGuests && <p className="text-xs text-red-600">{errors.numberOfGuests.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealPreference">Meal Preference</Label>
            <Controller
              control={control}
              name="mealPreference"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                    <SelectItem value="no-preference">No Preference</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Notes</Label>
            <Textarea id="message" placeholder="Any special requests or notes about this guest..." rows={3} {...register('message')} />
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

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
                  Adding...
                </>
              ) : (
                'Add Guest'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 