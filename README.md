# Instagram-like Social Media Web Application

A full-stack Instagram-inspired social media web application built with React, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

### 🔐 Authentication
- Email/password signup and login
- Session persistence
- Protected routes
- Automatic profile creation on signup

### 👤 User Profiles
- Customizable profile (username, bio, full name, avatar)
- Edit profile functionality
- Avatar upload
- View other users' profiles
- Followers and following counts
- Posts count

### 📸 Posts
- Create posts with images and captions
- Image upload to Supabase Storage
- Global feed with infinite scroll
- Post deletion (own posts only)
- Skeleton loaders while loading

### ❤️ Likes System
- Like/unlike posts
- Real-time like count updates
- Optimistic UI updates
- One like per user per post

### 💬 Comments System
- Add comments on posts
- View all comments
- Comment count updates
- Delete own comments
- Comments sorted by time

### 👥 Follow System
- Follow/unfollow users
- Followers and following counts
- Optimistic UI updates

### 🎨 UI/UX
- Modern Instagram-inspired design
- Mobile-first responsive layout
- Smooth animations
- Professional spacing and typography
- Dark mode support
- Clean component structure

### 🔒 Security
- Row Level Security (RLS) enabled on all tables
- Users can only edit their own content
- Secure file uploads
- Protected API endpoints

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **React Router** - Routing
- **date-fns** - Date formatting
- **react-infinite-scroll-component** - Infinite scroll

### Backend
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Storage
  - Row Level Security

## Project Structure

```
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Layout.tsx      # Main layout with navigation
│   │   ├── PostCard.tsx    # Post display component
│   │   ├── CommentsDialog.tsx
│   │   └── ProtectedRoute.tsx
│   ├── lib/                # Utilities and API
│   │   ├── api.ts          # API abstraction layer
│   │   ├── supabase.ts     # Supabase client
│   │   └── utils.ts        # Utility functions
│   ├── pages/              # Page components
│   │   ├── (auth)/         # Authentication pages
│   │   └── (main)/         # Main app pages
│   ├── store/              # Zustand stores
│   │   └── authStore.ts    # Authentication state
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   └── App.tsx             # Main app component
├── supabase/
│   ├── schema.sql          # Database schema
│   ├── rls-policies.sql    # Row Level Security policies
│   └── storage-setup.md    # Storage buckets setup guide
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd new-project
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Get your project URL and anon key from Settings → API
   
   c. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**

   a. Go to SQL Editor in your Supabase dashboard
   
   b. Run the SQL from `supabase/schema.sql` to create tables
   
   c. Run the SQL from `supabase/rls-policies.sql` to set up security policies

5. **Set up Storage**

   Follow the instructions in `supabase/storage-setup.md` to create storage buckets and policies.

6. **Run the development server**

```bash
npm run dev
```

7. **Open your browser**

Navigate to `http://localhost:5173` (or the port shown in terminal)

## Database Schema

### Tables

- **profiles** - User profile information
- **posts** - User posts with images and captions
- **likes** - Post likes (many-to-many relationship)
- **comments** - Post comments
- **follows** - User follow relationships

See `supabase/schema.sql` for complete schema details.

## Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Authentication Flow

1. User signs up with email, password, username, and optional full name
2. Profile is automatically created via database trigger
3. User session is stored and persists on page refresh
4. Protected routes redirect unauthenticated users to login

### Post Creation

1. User uploads an image (stored in Supabase Storage)
2. User adds an optional caption
3. Post is created in the database
4. Post appears in the global feed

### Like System

- Optimistic UI updates for instant feedback
- Prevents duplicate likes via database unique constraint
- Real-time like count updates

### Comments System

- Comments displayed in a modal dialog
- Sorted by creation time (oldest first)
- Users can delete their own comments
- Comment counts update automatically

### Follow System

- Users can follow/unfollow other users
- Followers and following counts update in real-time
- Optimistic UI updates for better UX

## Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only:
  - Edit their own profiles
  - Delete their own posts and comments
  - Like once per post
  - Follow/unfollow users
- File uploads are validated and stored securely
- All API calls go through Supabase with RLS enforcement

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning or as a starting point for your own applications.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Supabase](https://supabase.com/) for the amazing backend platform
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
