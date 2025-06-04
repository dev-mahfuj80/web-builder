# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SaaS website builder and project management platform built with Next.js 14, featuring a multi-tenant B2B2B architecture. The application allows agencies to create sub-accounts, build funnels/websites, manage pipelines, and handle Stripe payments with a drag-and-drop editor.

## Development Commands

```bash
# Development
bun install          # Install dependencies 
bun dev             # Start development server
bun build           # Build production version
bun start           # Start production server
bun lint            # Run ESLint

# Database
npx prisma generate  # Generate Prisma client (runs automatically on postinstall)
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open Prisma Studio for database inspection
npx prisma migrate dev # Create and apply migration
```

## Architecture Overview

### Multi-Tenant Structure
- **Agencies**: Top-level organizations that can have multiple sub-accounts
- **Sub-accounts**: Client accounts managed by agencies with their own funnels, media, pipelines
- **Role-based access**: AGENCY_OWNER, AGENCY_ADMIN, SUBACCOUNT_USER, SUBACCOUNT_GUEST

### Key Technology Stack
- **Frontend**: Next.js 14 with App Router, React 19, TypeScript
- **Database**: PostgreSQL with Prisma ORM (relationMode: "prisma")
- **Authentication**: Clerk for user management
- **Payments**: Stripe Connect for multi-vendor payments
- **UI**: Tailwind CSS, Radix UI components, shadcn/ui components
- **File Upload**: UploadThing for media management
- **Charts**: Tremor React for analytics dashboards

### Routing Structure
- `/site` - Public landing page
- `/agency/[agencyId]` - Agency dashboard and management
- `/subaccount/[subaccountId]` - Sub-account specific features
- `/[domain]/[path]` - Custom funnel/website hosting via subdomain middleware

### Core Features Architecture

**Funnel Builder System:**
- Drag & drop editor in `/src/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor`
- Component-based system with recursive rendering
- Real-time preview with customizable layouts
- Built-in components: containers, text, videos, contact forms, checkout

**Pipeline Management:**
- Kanban-style interface for project management
- Tickets with tags, assignments, and monetary values
- Automated triggers and actions for workflow automation
- Lane-based organization similar to Trello/Monday.com

**Media Management:**
- Centralized media library per sub-account
- UploadThing integration for file uploads
- Support for images, videos, and documents

### Database Patterns

The Prisma schema follows these patterns:
- All models use UUID primary keys
- Cascade deletions for parent-child relationships
- Extensive use of indexes for performance
- Relation mode set to "prisma" for better compatibility

Key relationships:
- Agency → SubAccount (1:many)
- SubAccount → Funnels, Media, Pipelines (1:many) 
- Pipeline → Lanes → Tickets (nested hierarchy)
- Users have Permissions for specific SubAccounts

### Global State Management

**Modal System:** Uses React Context (`/src/providers/modal-provider.tsx`) for managing global modals with:
- Dynamic modal content rendering
- Async data fetching before modal display
- Centralized state for user, agency, ticket, and plan data

**Editor State:** Funnel editor uses Context API for:
- Drag & drop state management
- Component selection and styling
- Undo/redo functionality
- Real-time preview updates

### Authentication & Authorization

Clerk handles authentication with custom middleware (`/src/middleware.ts`) that:
- Protects routes based on user roles
- Handles subdomain rewrites for custom funnel domains
- Redirects unauthenticated users appropriately
- Public routes: `/site`, `/api/uploadthing`

### Development Patterns

**Server Actions:** Extensive use of 'use server' in `/src/lib/queries.ts` for:
- Database operations with proper error handling
- Integration with Clerk for user context
- Revalidation of cached data after mutations

**Type Safety:** Strong TypeScript patterns:
- Prisma-generated types extended in `/src/lib/types.ts`
- Zod schemas for form validation
- Complex nested types for database relations

**Component Architecture:**
- Reusable UI components in `/src/components/ui/` (shadcn/ui)
- Feature-specific components organized by domain
- Global components for shared functionality (modals, sidebars)

### Environment Variables Required

```
DATABASE_URL=          # PostgreSQL connection string
NEXT_PUBLIC_DOMAIN=    # Your domain for subdomain routing
CLERK_SECRET_KEY=      # Clerk authentication
UPLOADTHING_SECRET=    # File upload service
STRIPE_SECRET_KEY=     # Stripe payments
```

### Testing Patterns

When implementing tests:
- Use the existing database patterns with proper cleanup
- Mock Clerk authentication in test environment
- Test server actions independently from UI components
- Use Prisma's testing utilities for database operations

### Common Development Tasks

**Adding New Models:**
1. Update `/prisma/schema.prisma`
2. Run `npx prisma db push` or create migration
3. Add corresponding types in `/src/lib/types.ts`
4. Create queries in `/src/lib/queries.ts`

**Adding New Routes:**
1. Follow App Router conventions in `/src/app/`
2. Consider authentication requirements in middleware
3. Add proper TypeScript types for params/searchParams

**Integrating New UI Components:**
1. Add to `/src/components/ui/` if reusable
2. Follow existing patterns for form handling with react-hook-form + Zod
3. Use existing modal system for dialogs/overlays