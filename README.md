# Newly - Wedding RSVP Platform

A beautiful, modern platform for creating elegant wedding RSVP pages and managing guest responses.

## 🚀 Features

- **Beautiful RSVP Pages**: Create stunning, customizable RSVP pages for your wedding
- **Guest Management**: Add guests manually or import from CSV
- **Real-time Analytics**: Track RSVP responses with beautiful charts
- **Mobile Responsive**: Works perfectly on all devices
- **Custom Themes**: Choose from beautiful themes or customize your own
- **Export Data**: Export guest lists and RSVP data as CSV

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** + **shadcn/ui**
- **Clerk** (Authentication)
- **React Hook Form** + **Zod** (Form validation)
- **Recharts** (Analytics)

### Backend (Coming Soon)
- **NestJS**
- **PostgreSQL** + **Prisma**
- **BullMQ** (Queue management)

## 📦 Project Structure

```
newly/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/         # App router pages
│   │   │   ├── components/  # React components
│   │   │   └── lib/         # Utilities
│   │   └── package.json
│   └── backend/             # NestJS backend (coming soon)
├── packages/
│   └── shared/              # Shared types and utilities
├── package.json
└── turbo.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 10+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd newly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cd apps/web
   cp .env.example .env.local
   ```
   
   Add your Clerk credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Available Pages

- **Landing Page** (`/`) - Marketing page with features and pricing
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration
- **Dashboard** (`/dashboard`) - Main dashboard with overview
- **Guests** (`/dashboard/guests`) - Guest management (coming soon)
- **Analytics** (`/dashboard/analytics`) - RSVP analytics (coming soon)
- **Settings** (`/dashboard/settings`) - Account settings (coming soon)

## 🎨 Design System

The project uses a custom design system built with:
- **TailwindCSS** for styling
- **shadcn/ui** for pre-built components
- **Lucide React** for icons
- Custom color palette: Pink to Purple gradient theme

## 🔧 Development

### Available Scripts

```bash
# Root level
npm run dev          # Start all apps in development
npm run build        # Build all apps
npm run lint         # Lint all apps
npm run test         # Run tests

# Web app specific
cd apps/web
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
```

### Adding New Components

1. Use shadcn/ui to add new components:
   ```bash
   npx shadcn@latest add [component-name]
   ```

2. Create custom components in `src/components/`

### Styling Guidelines

- Use TailwindCSS utility classes
- Follow the established color palette
- Maintain responsive design principles
- Use shadcn/ui components as base

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Coming Soon)

- **Render/Railway**: For easy deployment
- **AWS ECS Fargate**: For production scaling
- **PlanetScale/Supabase**: For database hosting

## 📈 Roadmap

### MVP Features
- [x] Landing page
- [x] User authentication
- [x] Dashboard layout
- [ ] Event creation
- [ ] Guest management
- [ ] RSVP form
- [ ] Analytics dashboard

### Future Enhancements
- [ ] Email reminders
- [ ] WhatsApp integration
- [ ] Custom domains
- [ ] AI-generated content
- [ ] Multiple events support
- [ ] Vendor integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Coming soon]
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@newly.com

---

Built with ❤️ for couples planning their special day. 