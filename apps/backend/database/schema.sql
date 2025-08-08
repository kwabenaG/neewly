-- Newly Database Schema
-- Run this in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "lastName" VARCHAR NOT NULL,
    avatar VARCHAR,
    role VARCHAR DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    "isEmailVerified" BOOLEAN DEFAULT false,
    "clerkId" VARCHAR,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description TEXT,
    "eventDate" DATE NOT NULL,
    venue VARCHAR,
    "venueAddress" VARCHAR,
    "bannerImage" VARCHAR,
    status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    slug VARCHAR UNIQUE NOT NULL,
    "isPublic" BOOLEAN DEFAULT false,
    "guestLimit" INTEGER DEFAULT 50,
    theme JSONB,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    email VARCHAR,
    "numberOfGuests" INTEGER DEFAULT 1,
    status VARCHAR DEFAULT 'invited' CHECK (status IN ('invited', 'confirmed', 'declined', 'pending')),
    "mealPreference" VARCHAR,
    message TEXT,
    "phoneNumber" VARCHAR,
    "additionalInfo" JSONB,
    "eventId" UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users("clerkId");
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events("userId");
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_public ON events("isPublic");
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests("eventId");
CREATE INDEX IF NOT EXISTS idx_guests_status ON guests(status);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic examples - adjust as needed)
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = "clerkId");

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = "clerkId");

-- Users can only see their own events
CREATE POLICY "Users can view own events" ON events
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = "userId"));

-- Users can manage their own events
CREATE POLICY "Users can manage own events" ON events
    FOR ALL USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = "userId"));

-- Public events can be viewed by anyone
CREATE POLICY "Public events are viewable by all" ON events
    FOR SELECT USING ("isPublic" = true);

-- Guests can be viewed by event owners
CREATE POLICY "Event owners can view guests" ON guests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events e 
            JOIN users u ON e."userId" = u.id 
            WHERE e.id = "eventId" AND u."clerkId" = auth.uid()::text
        )
    );

-- Anyone can create guests (for RSVP functionality)
CREATE POLICY "Anyone can create guests" ON guests
    FOR INSERT WITH CHECK (true);

-- Anyone can update guest status (for RSVP functionality)
CREATE POLICY "Anyone can update guest status" ON guests
    FOR UPDATE USING (true); 