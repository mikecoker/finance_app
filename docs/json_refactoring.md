# JSON Data Refactoring Documentation

## Overview

This document describes the refactoring of the Personal Finance Course application to use JSON data files instead of hardcoded data. This change improves maintainability, scalability, and separation of concerns.

## Data Structure

The application now uses three types of JSON files:

1. **modules.json** - Contains all module metadata
2. **lessons-metadata.json** - Contains metadata for all lessons across modules
3. **lesson-content/{lessonId}.json** - Individual files for each lesson's content

### Module Data Structure

```json
[
  {
    "id": "banking-fundamentals",
    "title": "Banking Fundamentals",
    "description": "Learn how banks operate, different account types, and how to choose the right bank for your needs.",
    "character": "cash",
    "level": "foundation",
    "lessons": 5,
    "completedLessons": 0,
    "xpReward": 250,
    "prerequisites": [],
    "unlocked": true
  },
  // Additional modules...
]
```

### Lesson Metadata Structure

```json
[
  {
    "id": "banking-intro",
    "moduleId": "banking-fundamentals",
    "title": "Introduction to Banking",
    "description": "Learn what banks are and how they function in the economy.",
    "xpReward": 50,
    "completed": false,
    "locked": false,
    "current": true
  },
  // Additional lessons...
]
```

### Lesson Content Structure

```json
[
  {
    "type": "intro",
    "character": "cash",
    "title": "Introduction to Banking",
    "content": "Welcome to your first lesson on Banking Fundamentals! I'm Cash, and I'll be your guide as we explore how banks work and why they're important for your financial life."
  },
  // Additional lesson steps...
]
```

## Implementation Details

### Data Service

A new data service (`dataService.ts`) was created to handle loading data from JSON files and managing lesson progress. The service includes:

- Type definitions for data structures
- Functions to load modules, lesson metadata, and lesson content
- Functions to save and load progress from localStorage
- Error handling for data loading failures

### API Routes for Data Access

To serve the JSON data files, we implemented:

1. **Next.js API Route**: Created a dynamic API route at `/api/data/[...slug]/route.ts` that serves JSON files from the data directory
2. **Next.js Configuration**: Updated `next.config.js` to rewrite requests to `/data/*` to the API route
3. **Error Handling**: Implemented proper error handling for file not found and server errors

This approach allows the application to access the JSON data through API routes, which is more robust than importing JSON files directly and works well with Next.js's server components.

### Course Page Refactoring

The course page (`course/page.tsx`) was refactored to:

- Load data from JSON files using the data service
- Display a loading state while data is being fetched
- Maintain the existing functionality for lesson navigation and progress tracking
- Save progress to localStorage when lessons are completed

## Benefits

This refactoring provides several benefits:

1. **Separation of Content and Code**: Content can be updated without changing code
2. **Improved Maintainability**: Easier to add, modify, or remove content
3. **Better Scalability**: Can easily add more modules and lessons
4. **Content Management**: Potential for future integration with a CMS
5. **Reduced Bundle Size**: Content is loaded on demand rather than bundled with the application
6. **API-Based Access**: Standardized access to content through API routes

## Future Enhancements

Potential future enhancements include:

1. Creating a content management interface for non-developers to update content
2. Implementing server-side data storage for progress tracking
3. Adding content versioning and migration strategies
4. Implementing content preloading for improved performance
5. Adding support for multimedia content in lessons
6. Implementing caching strategies for improved performance
7. Adding authentication for protected content
