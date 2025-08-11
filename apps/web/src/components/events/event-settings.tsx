'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Calendar,
  Users,
  Palette,
  Save,
  Loader2
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

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

interface EventSettingsProps {
  event: Event;
  onUpdate: () => void;
}

const themeOptions = [
  { value: 'classic', label: 'Classic', description: 'Elegant and timeless design' },
  { value: 'modern', label: 'Modern', description: 'Clean and contemporary style' },
  { value: 'romantic', label: 'Romantic', description: 'Soft and dreamy aesthetic' },
  { value: 'rustic', label: 'Rustic', description: 'Natural and earthy tones' },
  { value: 'luxury', label: 'Luxury', description: 'Premium and sophisticated look' },
];

export function EventSettings({ event, onUpdate }: EventSettingsProps) {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description || '',
    venue: event.venue || '',
    venueAddress: event.venueAddress || '',
    startTime: event.startTime || '',
    endTime: event.endTime || '',
    coupleName: event.coupleName || '',
    guestLimit: event.guestLimit,
    theme: event.theme?.name || 'classic',
    isActive: event.isActive,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = await getToken();
      if (!token) return;
      
      const response = await apiClient.updateEvent(token, event.id, formData);
      if (response.success) {
        onUpdate();
        // Add success toast notification
      } else {
        // Add error toast notification
        console.error('Error updating event:', response.error);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coupleName">Couple Names (Optional)</Label>
              <Input
                id="coupleName"
                value={formData.coupleName}
                onChange={(e) => setFormData({ ...formData, coupleName: e.target.value })}
                placeholder="e.g., Sarah & Michael"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Event Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell your guests about your special day..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Enter venue name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="venueAddress">Venue Address</Label>
              <Input
                id="venueAddress"
                value={formData.venueAddress}
                onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                placeholder="Enter venue address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guestLimit">Guest Limit</Label>
              <Input
                id="guestLimit"
                type="number"
                value={formData.guestLimit}
                onChange={(e) => setFormData({ ...formData, guestLimit: parseInt(e.target.value) })}
                min="1"
                max="1000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    <div>
                      <div className="font-medium">{theme.label}</div>
                      <div className="text-sm text-gray-500">{theme.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {themeOptions.map((theme) => (
              <div
                key={theme.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.theme === theme.value
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFormData({ ...formData, theme: theme.value })}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{theme.label}</h4>
                  {formData.theme === theme.value && (
                    <Badge variant="default" className="bg-pink-500">Selected</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{theme.description}</p>
                <div className="mt-3 flex space-x-1">
                  <div className="w-4 h-4 rounded bg-pink-200"></div>
                  <div className="w-4 h-4 rounded bg-purple-200"></div>
                  <div className="w-4 h-4 rounded bg-blue-200"></div>
                  <div className="w-4 h-4 rounded bg-green-200"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Privacy & Access</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">RSVP Page Status</h4>
              <p className="text-sm text-gray-600">
                {formData.isActive 
                  ? 'Your RSVP page is currently active and accepting responses'
                  : 'Your RSVP page is currently inactive and not accepting responses'
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {formData.isActive ? (
                <Eye className="h-5 w-5 text-green-500" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-400" />
              )}
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">RSVP Link</h4>
            <div className="flex items-center space-x-2">
              <Input
                value={`${window.location.origin}/rsvp/${event.slug}`}
                readOnly
                className="bg-white"
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/rsvp/${event.slug}`);
                  // Add toast notification
                }}
              >
                Copy
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Share this link with your guests to allow them to RSVP
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 