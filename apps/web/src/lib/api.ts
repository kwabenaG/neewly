// API Configuration for connecting to NestJS backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      // If there's a body, ensure it's properly stringified
      if (options.body && typeof options.body === 'string') {
        try {
          const parsedBody = JSON.parse(options.body);
          console.log('Request details:', {
            url,
            method: options.method,
            headers: options.headers,
            body: parsedBody,
            bodyType: typeof parsedBody,
            titleType: typeof parsedBody.title,
            eventDateType: typeof parsedBody.eventDate,
            slugType: typeof parsedBody.slug,
          });
        } catch (e) {
          console.error('Error parsing request body:', e);
        }
      }
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      let data: any = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (_) {}
      } else {
        try {
          data = await response.text();
        } catch (_) {}
      }

      if (!response.ok) {
        const message = (data && (data.message || data.error)) || response.statusText;
        return { success: false, error: typeof message === 'string' ? message : JSON.stringify(message) };
      }

      return { data, success: true };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      };
    }
  }

  // Auth endpoints
  async getProfile(token: string) {
    return this.request('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async updateProfile(token: string, data: any) {
    return this.request('/auth/profile', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  // Users endpoints
  async getCurrentUser(token: string) {
    return this.request('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Events endpoints
  async getEvents(token: string) {
    return this.request('/events', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createEvent(token: string, eventData: any) {
    // Create a plain object with all fields as strings
    const formattedData = {
      title: `${eventData.title || ''}`,
      eventDate: `${eventData.eventDate || ''}`,
      slug: `${eventData.slug || ''}`,
      description: `${eventData.description || ''}`,
      venue: `${eventData.venue || ''}`,
      venueAddress: `${eventData.venueAddress || ''}`,
      isPublic: false,
      guestLimit: 50,
    };

    // Log the data being sent
    console.log('Creating event with data:', formattedData);
    console.log('Data types:', {
      titleType: typeof formattedData.title,
      eventDateType: typeof formattedData.eventDate,
      slugType: typeof formattedData.slug,
    });

    // Create a new object with the stringified data
    const requestBody = JSON.stringify(formattedData);
    console.log('Request body (raw):', requestBody);

    return this.request('/events', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });
  }

  async getEvent(token: string, eventId: string) {
    return this.request(`/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async updateEvent(token: string, eventId: string, eventData: any) {
    return this.request(`/events/${eventId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(token: string, eventId: string) {
    return this.request(`/events/${eventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Public event endpoints (no auth required)
  async getPublicEvent(slug: string) {
    return this.request(`/events/public/${slug}`);
  }

  // Guests endpoints
  async getEventGuests(token: string, eventId: string) {
    return this.request(`/guests/event/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getEventStats(token: string, eventId: string) {
    return this.request(`/guests/event/${eventId}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createGuest(token: string, guestData: any) {
    return this.request('/guests', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(guestData),
    });
  }

  // Public RSVP endpoints (no auth required)
  async submitRSVP(rsvpData: any) {
    return this.request('/guests/rsvp', {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    });
  }

  async submitEventRSVP(eventId: string, rsvpData: any) {
    return this.request(`/events/${eventId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    });
  }

  async updateRSVP(guestId: string, status: string) {
    return this.request(`/guests/public/${guestId}/rsvp`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getPublicEventStats(eventId: string) {
    return this.request(`/guests/public/event/${eventId}/stats`);
  }

  // Analytics endpoints
  async getRsvpAnalytics(token: string, days: number = 30) {
    return this.request(`/analytics/rsvp?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getEventAnalytics(token: string, eventId: string) {
    return this.request(`/analytics/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Guest management endpoints
  async getAllGuests(token: string) {
    return this.request('/guests', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async updateGuest(token: string, guestId: string, guestData: any) {
    return this.request(`/guests/${guestId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(guestData),
    });
  }

  async deleteGuest(token: string, guestId: string) {
    return this.request(`/guests/${guestId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async importGuests(token: string, file: File, eventId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('eventId', eventId);

    return this.request('/guests/import', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  }

  // File upload endpoints
  async uploadAvatar(token: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload/avatar', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  }

  async uploadEventBanner(token: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload/event-banner', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 