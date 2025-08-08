# Product Requirements Document (PRD) - **Neewly**

## 1. Overview
**Neewly** is a Micro-SaaS platform that allows couples and event planners to create beautifully designed RSVP pages, manage guest lists, and track responses with ease. It eliminates the complexity of paper invites and spreadsheets by offering a smart, elegant experience built with modern technology.

---

## 2. Target Users
- Engaged couples planning their wedding
- Event planners or coordinators
- Small event hosts (for version 2 expansion)

---

## 3. Core Features

### A. Couple/Planner Dashboard
- Login/Register with Clerk or Supabase
- Create & edit wedding/event details (title, date, venue, description)
- Generate RSVP link
- Customize design/theme (basic color presets)
- Upload engagement photo or banner
- Guest List Manager
  - Add guest manually
  - Import CSV
  - View guest response status
- View RSVP analytics (graph of confirmed, declined, no response)
- Option to turn RSVP on/off
- Export guest data (CSV download)

### B. Guest RSVP Page
- View wedding banner, couple names, and event details
- Fill RSVP form:
  - Name
  - Email
  - Number of guests
  - Meal preference (optional)
  - Song request (optional)
  - Personal message to couple
- Confirmation screen + calendar invite (.ics)
- Mobile-friendly & shareable design

---

## 4. Landing Page (✅ Completed)

### Purpose
Convert visitors into registered users by clearly showcasing the platform's value, features, and ease of use. Built using **Next.js**, **TailwindCSS**, and responsive design principles.

### URL
- `/`

### Completed Sections
- **Hero Section** ✅
  - Modern gradient design with animated background elements
  - Interactive typewriter effect with rotating headlines
  - Lead generation form with user type selection
  - Animated background particles
  - Mobile responsive layout
  - Accessibility improvements (ARIA labels, semantic HTML)

- **Features Section** ✅
  - Guest Management Made Easy
  - Live RSVP Analytics
  - Custom Themes & Branding
  - Mobile App features showcase
  - Beautiful animated card layouts with hover effects

- **Integrations Section** ✅
  - Calendar sync (Google & Apple)
  - Payment systems (Stripe & PayPal)
  - Email marketing (Mailchimp & SendGrid)
  - CRM integrations (HubSpot & Salesforce)
  - Professional integration showcase

- **Mobile App Preview** ✅
  - Beautiful 3D mockup with rotation effect
  - Key features highlighted (QR check-ins, notifications, offline mode)
  - App store and Play store buttons
  - Animated display with feature list

- **Success Stories** ✅
  - Wedding case study (Sarah & Michael - 350+ guests)
  - Event planner testimonial (Elite Events NYC)
  - Real metrics and conversion data
  - Professional testimonials with avatars

- **Pricing Section** ✅
  - Three-tier structure (Basic, Pro, Enterprise)
  - Detailed comparison table
  - Feature breakdown by plan
  - Clear value proposition and CTAs

- **How it Works** ✅
  - 4-step process (Sign Up, Customize, Add Guests, Share)
  - Visual icons for each step
  - Clear explanations and benefits
  - Animated transitions

- **Blog/Resources Section** ✅
  - Wedding planning resources
  - Expert tips and guides
  - Three featured articles with gradients
  - SEO-friendly content for organic traffic

- **FAQ Section** ✅
  - Split by user type (Event Planners vs Couples)
  - Comprehensive answers to common questions
  - Professional use case scenarios
  - Personal wedding planning needs

- **Trust Badges Section** ✅
  - SSL Secured certification
  - GDPR Compliant badge
  - 99.9% Uptime guarantee
  - 24/7 Support commitment

- **Contact Section** ✅
  - Multiple contact methods (email, chat, phone)
  - Interactive contact form with validation
  - Subject categorization
  - Professional support information

- **Footer** ✅
  - Social media icons with hover animations
  - Navigation links organized by category
  - Company information and legal links
  - Copyright and year display

- **Form Validation & UX** ✅
  - Comprehensive form validation (lead gen + contact)
  - Real-time error display with visual indicators
  - Email validation with regex
  - Loading states with animated spinners
  - Success states with confirmation messages
  - Form reset functionality

- **Accessibility Features** ✅
  - ARIA labels and descriptions throughout
  - Role attributes for screen readers
  - Keyboard navigation support
  - Semantic HTML structure
  - Error announcements with role="alert"
  - Focus management and visual indicators

- **Cookie Consent** ✅
  - GDPR compliant cookie banner
  - Local storage persistence
  - Accept/Decline options with clear descriptions
  - Animated slide-up presentation
  - Proper ARIA dialog attributes

### Remaining Landing Page Tasks
1. ⏳ Connect contact form to backend API
2. ⏳ Set up email notifications for form submissions
3. ⏳ Add live chat widget integration
4. ⏳ Add Google Analytics and tracking
5. ⏳ Add SEO meta tags and Open Graph
6. ⏳ Performance optimization and lazy loading

---

## 5. Tech Stack

### Frontend (✅ In Progress)
- **Next.js (App Router)** ✅
- **TailwindCSS + shadcn/ui** ✅
- **Clerk/Supabase** (auth)
- **React Hook Form + Zod**
- **Recharts** (for RSVP analytics)
- Responsive layout with optimized Lighthouse scores

### Backend (⏳ Ready to Start)
- **NestJS** with REST API architecture
- **PostgreSQL** via Prisma ORM
- **Queue support (BullMQ)** for email notifications
- **Rate limiting** for public form submissions
- **JWT Authentication** with Clerk integration
- **File upload** for event images
- **Email service** for notifications and confirmations

### DevOps & Hosting
- **Vercel** for frontend
- **Render / Railway / Fly.io / AWS ECS Fargate** for backend
- **PlanetScale or Supabase DB** (optional)

---

## 6. Current Development Status

### ✅ Phase 1: Landing Page (COMPLETED)
- **Timeline**: Completed
- **Status**: Production Ready
- **Features**: All landing page sections implemented with full functionality
- **Next Steps**: Deploy to Vercel and connect analytics

### ⏳ Phase 2: Backend Development (NEXT)
- **Timeline**: In Progress
- **Priority Tasks**:
  1. Set up NestJS project structure
  2. Configure PostgreSQL with Prisma
  3. Implement authentication with Clerk
  4. Create core API endpoints (events, guests, RSVPs)
  5. Set up email notification system
  6. Add file upload for event images
  7. Implement rate limiting and security

### 📋 Phase 3: Dashboard & RSVP Pages (UPCOMING)
- **Timeline**: After backend completion
- **Key Features**:
  1. User dashboard with event management
  2. Guest list management interface
  3. Analytics and reporting dashboard
  4. Public RSVP pages for guests
  5. Mobile responsive design

---

## 7. MVP Requirements (Updated)

### Completed Pages:
- ✅ `/` (Landing Page) - Production ready

### Next Development Priority:
- ⏳ Backend API setup and core functionality
- ⏳ Authentication system integration
- ⏳ Database schema and migrations

### Upcoming Pages:
- `/login` - Authentication page
- `/register` - User registration
- `/dashboard` - Main user dashboard
- `/dashboard/guests` - Guest management
- `/dashboard/analytics` - RSVP analytics
- `/rsvp/[slug]` - Public RSVP pages
- `/success` - RSVP confirmation

---