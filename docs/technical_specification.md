# Personal Finance Course Application - Technical Specification

## Overview

This document outlines the technical specifications for implementing the Personal Finance Course as an interactive web application using Next.js, which can later be wrapped with Capacitor for mobile deployment. The application will follow a Duolingo-style approach with progressive learning paths, interactive elements, and gamification features.

## Technology Stack

### Frontend
- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **State Management**: React Context API + React Query
- **UI Components**: Custom components with shadcn/ui
- **Visualization**: Recharts for graphs and data visualization
- **Icons**: Lucide icons

### Backend
- **API Routes**: Next.js API routes with Cloudflare Workers
- **Database**: D1 (Cloudflare's SQL database)
- **Authentication**: NextAuth.js

### Mobile Wrapper
- **Framework**: Capacitor
- **Platforms**: iOS and Android

## Application Architecture

### Core Modules

1. **User Management**
   - Authentication (sign up, login, password reset)
   - Profile management
   - Progress tracking
   - Settings and preferences

2. **Course Navigation**
   - Module selection interface
   - Learning path visualization
   - Progress indicators
   - Achievement display

3. **Lesson Delivery**
   - Content presentation
   - Interactive elements integration
   - Quiz system
   - Feedback mechanisms

4. **Gamification System**
   - XP and level tracking
   - Achievement management
   - Streak monitoring
   - Leaderboards (optional)

5. **Data Management**
   - User progress persistence
   - Content delivery
   - Analytics collection
   - Synchronization for offline use

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_count INTEGER DEFAULT 0,
  last_activity_date DATE
);
```

#### Modules Table
```sql
CREATE TABLE modules (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true
);
```

#### Lessons Table
```sql
CREATE TABLE lessons (
  id INTEGER PRIMARY KEY,
  module_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  FOREIGN KEY (module_id) REFERENCES modules(id)
);
```

#### User Progress Table
```sql
CREATE TABLE user_progress (
  user_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  status TEXT NOT NULL, -- 'locked', 'available', 'in_progress', 'completed'
  completion_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  score INTEGER,
  PRIMARY KEY (user_id, lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (module_id) REFERENCES modules(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);
```

#### Achievements Table
```sql
CREATE TABLE achievements (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  requirement_type TEXT NOT NULL, -- 'module_completion', 'streak', 'xp_total', etc.
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 20
);
```

#### User Achievements Table
```sql
CREATE TABLE user_achievements (
  user_id TEXT NOT NULL,
  achievement_id INTEGER NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, achievement_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (achievement_id) REFERENCES achievements(id)
);
```

## Application Routes

### Authentication Routes
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/auth/reset-password` - Password reset page

### Main Application Routes
- `/` - Dashboard/Home
- `/modules` - Module selection
- `/modules/[id]` - Module details and lesson selection
- `/lessons/[id]` - Lesson content
- `/profile` - User profile and progress
- `/achievements` - Achievements dashboard
- `/settings` - User settings

### API Routes
- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/progress/*` - Progress tracking
- `/api/modules/*` - Module and lesson data
- `/api/achievements/*` - Achievement management

## Component Structure

### Layout Components
- `AppLayout` - Main application layout with navigation
- `AuthLayout` - Layout for authentication pages
- `LessonLayout` - Layout for lesson content

### Navigation Components
- `TopNavbar` - Main navigation bar
- `ModuleNavigation` - Module selection interface
- `ProgressBar` - User progress visualization
- `BottomNavigation` - Mobile navigation bar

### Lesson Components
- `LessonContent` - Content presentation component
- `ContentScreen` - Individual content screen
- `QuizScreen` - Quiz presentation
- `InteractiveScenario` - Interactive scenario component
- `RealWorldApplication` - Application exercise component
- `LessonComplete` - Lesson completion screen

### Interactive Elements
- `MultipleChoiceQuiz` - Multiple choice question component
- `TrueFalseQuiz` - True/false question component
- `MatchingExercise` - Matching exercise component
- `DragAndDropExercise` - Drag and drop component
- `InteractiveCalculator` - Financial calculator component
- `DecisionSimulator` - Financial decision simulator

### Gamification Components
- `XPIndicator` - Experience points display
- `StreakCounter` - Streak tracking component
- `AchievementCard` - Achievement display
- `LevelProgress` - Level progression visualization
- `SkillTree` - Visual representation of course progression

## State Management

### Global State
- User authentication state
- Current module/lesson navigation state
- User progress and achievements
- Application settings

### Local State
- Current lesson progress
- Quiz answers and results
- Interactive element state
- Form inputs

## Data Flow

1. **User Authentication**
   - User logs in → Authentication state updated → User progress loaded
   - User progress determines available modules and lessons

2. **Module Navigation**
   - User selects module → Module data loaded → Available lessons displayed
   - Lesson availability based on prerequisites and user progress

3. **Lesson Progression**
   - User starts lesson → Lesson content loaded sequentially
   - User interacts with content → Responses recorded
   - Lesson completed → Progress updated → XP awarded → Achievements checked

4. **Progress Synchronization**
   - Progress saved to local storage for offline use
   - Synchronized with server when online
   - Conflict resolution prioritizes most recent or highest score

## Responsive Design

The application will implement a responsive design approach:

1. **Desktop View (>1024px)**
   - Sidebar navigation
   - Multi-column layout for module selection
   - Expanded interactive elements
   - Side-by-side content and interaction areas

2. **Tablet View (768px-1024px)**
   - Collapsible sidebar navigation
   - Reduced column layout
   - Optimized interactive elements
   - Vertical stacking of some content areas

3. **Mobile View (<768px)**
   - Bottom navigation bar
   - Single column layout
   - Touch-optimized interactive elements
   - Fully vertical content flow

## Offline Functionality

The application will support offline use through:

1. **Content Caching**
   - Core application shell cached via service worker
   - Current and next module content pre-cached
   - Static assets (images, icons) cached

2. **Progress Storage**
   - Local storage for current progress
   - IndexedDB for comprehensive progress data
   - Queued API calls for synchronization when online

3. **Synchronization**
   - Background sync when connection restored
   - Conflict resolution for progress data
   - Notification of successful synchronization

## Performance Optimization

1. **Code Splitting**
   - Route-based code splitting
   - Component-level code splitting for large interactive elements
   - Dynamic imports for non-critical functionality

2. **Asset Optimization**
   - Image optimization and responsive images
   - Font subsetting
   - SVG optimization for icons

3. **Rendering Optimization**
   - Server-side rendering for initial content
   - Static generation for unchanging content
   - Client-side rendering for interactive elements

## Accessibility Considerations

The application will meet WCAG 2.1 AA standards:

1. **Keyboard Navigation**
   - Full keyboard accessibility
   - Focus management
   - Skip navigation links

2. **Screen Reader Support**
   - Semantic HTML
   - ARIA attributes where needed
   - Alternative text for visual content

3. **Visual Accessibility**
   - High contrast mode
   - Resizable text
   - Color blind friendly design

## Security Considerations

1. **Authentication**
   - Secure authentication flow
   - Password policies
   - Rate limiting for login attempts

2. **Data Protection**
   - HTTPS for all communications
   - Secure storage of user data
   - Minimal collection of personal information

3. **Input Validation**
   - Client and server-side validation
   - Sanitization of user inputs
   - Protection against common vulnerabilities

## Implementation Phases

### Phase 1: Core Framework (2-3 weeks)
- Project setup and configuration
- Database schema implementation
- Authentication system
- Basic navigation structure
- Module and lesson data models

### Phase 2: Content Delivery (3-4 weeks)
- Lesson content components
- Interactive element framework
- Quiz system implementation
- Progress tracking system
- Basic user profile

### Phase 3: Gamification (2-3 weeks)
- XP and leveling system
- Achievement framework
- Streak tracking
- Skill tree visualization
- Feedback mechanisms

### Phase 4: Mobile Optimization (2-3 weeks)
- Responsive design refinement
- Touch interaction optimization
- Offline functionality
- Capacitor integration
- Platform-specific adjustments

### Phase 5: Testing and Refinement (2-3 weeks)
- User testing
- Performance optimization
- Accessibility improvements
- Bug fixes and refinements
- Final polishing

## Next Steps

1. **Initial Setup**
   - Configure database migrations
   - Set up authentication system
   - Create basic application layout

2. **Module Implementation**
   - Implement module data structure
   - Create module navigation interface
   - Develop lesson selection components

3. **Lesson Framework**
   - Build lesson content components
   - Implement interactive element prototypes
   - Create quiz system framework

4. **User Progress**
   - Develop progress tracking system
   - Implement XP and leveling
   - Create user profile interface

This technical specification provides a comprehensive roadmap for implementing the Personal Finance Course application. The modular approach allows for incremental development and testing, with each phase building upon the previous one to create a complete, engaging learning experience.
