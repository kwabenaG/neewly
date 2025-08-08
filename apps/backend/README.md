# Newly Backend API

A comprehensive NestJS backend API for the Newly wedding RSVP platform, built with TypeScript, PostgreSQL, and real-time WebSocket support.

## Features

- 🔐 **Authentication**: Clerk-based authentication with JWT tokens
- 📊 **Event Management**: Create, update, and manage wedding events
- 👥 **Guest Management**: RSVP system with real-time updates
- 📧 **Email Notifications**: Automated email notifications for RSVPs
- 📁 **File Upload**: Image upload support (AWS S3 or local storage)
- 🔄 **Real-time Updates**: WebSocket support for live updates
- 📚 **API Documentation**: Swagger/OpenAPI documentation
- 🧪 **Testing**: Comprehensive test suite with Jest

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Clerk
- **Real-time**: Socket.io
- **File Upload**: Multer + AWS S3
- **Email**: Resend
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- Clerk account for authentication
- AWS S3 bucket (optional, for file uploads)
- Resend account (optional, for email notifications)

## Environment Variables

Create a `.env` file in the `apps/backend` directory:

```env
# Database Configuration
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Application Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Clerk Configuration
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_JWT_ISSUER=https://clerk.your-domain.com

# Email Configuration
RESEND_API_KEY=re_your_resend_api_key

# File Upload Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=neewly-uploads
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables (see above)

3. Run the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`

## API Documentation

Once the server is running, visit `http://localhost:3001/api` for interactive API documentation.

## Database Schema

### Users
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `firstName`: String
- `lastName`: String
- `avatar`: String (Optional)
- `role`: Enum (USER, ADMIN)
- `isEmailVerified`: Boolean
- `clerkId`: String (Optional)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Events
- `id`: UUID (Primary Key)
- `title`: String
- `description`: Text (Optional)
- `eventDate`: Date
- `venue`: String (Optional)
- `venueAddress`: String (Optional)
- `bannerImage`: String (Optional)
- `status`: Enum (DRAFT, ACTIVE, COMPLETED, CANCELLED)
- `slug`: String (Unique)
- `isPublic`: Boolean
- `guestLimit`: Number
- `theme`: JSONB (Optional)
- `userId`: UUID (Foreign Key)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Guests
- `id`: UUID (Primary Key)
- `name`: String
- `email`: String (Optional)
- `numberOfGuests`: Number
- `status`: Enum (INVITED, CONFIRMED, DECLINED, PENDING)
- `mealPreference`: String (Optional)
- `message`: Text (Optional)
- `phoneNumber`: String (Optional)
- `additionalInfo`: JSONB (Optional)
- `eventId`: UUID (Foreign Key)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## API Endpoints

### Authentication
- `GET /auth/profile` - Get current user profile
- `POST /auth/profile` - Update current user profile

### Users
- `GET /users/me` - Get current user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Events
- `POST /events` - Create new event
- `GET /events` - Get all user events
- `GET /events/:id` - Get event by ID
- `GET /events/public/:slug` - Get public event by slug
- `PATCH /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Guests
- `POST /guests` - Create new guest (authenticated)
- `POST /guests/rsvp` - Public RSVP endpoint
- `GET /guests/event/:eventId` - Get all guests for event
- `GET /guests/event/:eventId/stats` - Get event statistics
- `GET /guests/public/event/:eventId/stats` - Get public event statistics
- `PATCH /guests/:id` - Update guest
- `PATCH /guests/:id/status` - Update guest status
- `PATCH /guests/public/:id/rsvp` - Public RSVP status update
- `DELETE /guests/:id` - Delete guest

### File Upload
- `POST /upload/avatar` - Upload user avatar
- `POST /upload/event-banner` - Upload event banner
- `POST /upload/image/:folder` - Upload image to specific folder

### Email
- `POST /email/test` - Send test email

## WebSocket Events

### Client to Server
- `join-event` - Join event room for real-time updates
- `leave-event` - Leave event room

### Server to Client
- `rsvp-updated` - Guest RSVP status updated
- `guest-count-updated` - Event guest count updated
- `new-guest` - New guest added to event
- `event-updated` - Event details updated

## Development

### Running Tests
```bash
npm run test
npm run test:watch
npm run test:cov
```

### Building for Production
```bash
npm run build
npm run start:prod
```

### Code Formatting
```bash
npm run format
npm run lint
```

## Deployment

### Using Turborepo
```bash
# Build all packages
npm run build

# Start production server
npm run start:prod
```

### Environment Setup
1. Set up a PostgreSQL database (Supabase recommended)
2. Configure Clerk authentication
3. Set up AWS S3 for file uploads (optional)
4. Configure Resend for email notifications (optional)
5. Set all required environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License. 