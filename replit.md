# AI Agent Workflow Designer

## Overview

This project is a visual, modular interface for designing, simulating, and evaluating autonomous AI agents operating within enterprise-grade workflows. It's built as a "Figma meets Unity for AI agents" platform that enables AI teams and domain experts to create complex agent workflows using drag-and-drop primitives.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack architecture with a clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: Zustand for client-side state management
- **Data Fetching**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Canvas**: React Flow for the node-based workflow designer

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based session storage

## Key Components

### 1. Workflow Designer Canvas
- **Node Types**: Actor (human, agent, system), Tool, and Orchestrator nodes
- **Visual Editor**: Drag-and-drop interface using React Flow
- **Real-time Updates**: Interactive canvas with live node property editing
- **Connection System**: Visual representation of data flow and control logic

### 2. Component Library
- **Modular Design**: Reusable workflow components (actors, tools, triggers, rewards)
- **Type Safety**: Full TypeScript coverage with shared schemas
- **UI Components**: Consistent design system using Radix UI primitives

### 3. Project Management System
- **Hierarchical Structure**: Projects contain scenarios, tools, and agents
- **Resource Organization**: Centralized management of workflow components
- **User Isolation**: Multi-tenant architecture with user-specific data

### 4. Simulation Engine
- **Workflow Execution**: Ability to run and test designed workflows
- **Real-time Monitoring**: Live simulation logs and progress tracking
- **Results Analysis**: Performance metrics and evaluation tools

## Data Flow

1. **User Interface**: React components handle user interactions
2. **State Management**: Zustand stores manage local state and canvas operations
3. **API Layer**: Express.js routes handle CRUD operations for projects, scenarios, tools, and agents
4. **Database Layer**: Drizzle ORM manages PostgreSQL interactions with type-safe queries
5. **Simulation Layer**: Backend processes execute workflows and return results

## External Dependencies

### Core Technologies
- **React Ecosystem**: React 18, React DOM, React Flow for canvas functionality
- **Database**: PostgreSQL via Neon Database with Drizzle ORM
- **UI Components**: Extensive Radix UI component library for accessible interfaces
- **Styling**: Tailwind CSS with PostCSS for optimized styling

### Development Tools
- **TypeScript**: Full type safety across the entire stack
- **Vite**: Fast development server and build tool
- **ESBuild**: Fast bundling for production builds
- **Replit Integration**: Development environment optimizations

### Notable Libraries
- **date-fns**: Date manipulation and formatting
- **zod**: Runtime type validation and schema definition
- **class-variance-authority**: Type-safe CSS class management
- **embla-carousel**: Carousel functionality for UI components

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon Database serverless PostgreSQL instance
- **Environment Variables**: Database URL and configuration via environment variables

### Production Build
- **Frontend**: Static assets built with Vite and served by Express
- **Backend**: Bundled Node.js application using ESBuild
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Single Process**: Combined frontend and backend deployment

### Key Features
- **Serverless Database**: Automatic scaling with Neon Database
- **TypeScript Compilation**: Build-time type checking and optimization
- **Asset Optimization**: Vite handles bundling, minification, and code splitting
- **Environment Flexibility**: Configurable for development and production environments

The architecture prioritizes developer experience with fast builds, type safety, and modern tooling while maintaining the flexibility to scale and extend the AI agent workflow designer functionality.