# Newly Backend API

Wedding RSVP Platform Backend API built with NestJS, TypeORM, and PostgreSQL.

## 🚀 Features

- **User Management** - Complete user CRUD operations
- **Event Management** - Create and manage wedding events
- **Guest Management** - Handle guest lists and RSVPs
- **Authentication** - JWT-based authentication (Clerk integration)
- **API Documentation** - Swagger/OpenAPI documentation

## 🛠 Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Swagger** - API Documentation
- **TypeScript** - Type safety

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Database setup:**
   - Install PostgreSQL
   - Create a database named `newly`
   - Update `.env` with your database credentials

## 🚀 Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

## 🗄 Database Schema

### Users
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `firstName` (String)
- `lastName` (String)
- `avatar` (String, Optional)
- `role` (Enum: USER, ADMIN)
- `clerkId` (String, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Events
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text, Optional)
- `eventDate` (Date)
- `venue` (String, Optional)
- `venueAddress` (String, Optional)
- `bannerImage` (String, Optional)
- `status` (Enum: DRAFT, ACTIVE, COMPLETED, CANCELLED)
- `slug` (String, Unique)
- `isPublic` (Boolean)
- `guestLimit` (Number)
- `theme` (JSON, Optional)
- `userId` (UUID, Foreign Key)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Guests
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Optional)
- `numberOfGuests` (Number)
- `status` (Enum: INVITED, CONFIRMED, DECLINED, PENDING)
- `mealPreference` (String, Optional)
- `message` (Text, Optional)
- `phoneNumber` (String, Optional)
- `additionalInfo` (JSON, Optional)
- `eventId` (UUID, Foreign Key)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## 🔧 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage

## 🔐 Authentication

The API uses JWT tokens for authentication. Integration with Clerk is planned for user management.

## 📝 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=newly

# Application
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## 🚀 Next Steps

1. Set up PostgreSQL database
2. Configure environment variables
3. Integrate with Clerk authentication
4. Add email notifications
5. Implement file uploads for images
6. Add rate limiting and security measures 