# CollegeFinder

A frontend-only college discovery platform built with Next.js, React, TypeScript, and Tailwind CSS. Students can search and filter colleges, compare institutions side by side, view detailed profiles with placement statistics and reviews, and save shortlists; all persisted client-side with no backend required.

---

## Features

| Feature | Description |
|---|---|
| **College Listing** | Paginated grid or list view with live search, multi-faceted filters, active filter chips, and six sort options |
| **College Detail** | Sticky section nav (Overview, Courses, Placements, Reviews) with rich data per institution |
| **Compare** | Side-by-side comparison table for up to 3 colleges with best-value highlighting per metric |
| **Saved Items** | Tabbed view of saved colleges and named saved comparisons, persisted in `localStorage` |
| **Auth UI** | Login and signup forms with validation, password-strength indicator, and demo credentials — fully mocked client-side |
| **Responsive** | Mobile-first layout: slide-up filter drawer on mobile, sticky compare bar, list-view stats always visible |
| **Accessibility** | `focus-visible` rings, `aria-label`/`aria-pressed`/`aria-expanded` on all interactive elements, focus-trapped modal, scroll-spy section nav |

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | File-based routing, server components, `next/font`, and zero-config deploys on Vercel |
| Language | TypeScript 5 | Catches prop shape mismatches and store type errors at build time |
| Styling | Tailwind CSS v4 | Utility-first with CSS custom properties for design tokens; no runtime style overhead |
| State | Zustand 5 + `persist` middleware | Minimal boilerplate, selector-based subscriptions, and automatic `localStorage` sync |
| React | React 19 | Concurrent features; no additional router or data-fetching library needed |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (auth)/
│   │   ├── login/page.tsx      # Login page
│   │   └── signup/page.tsx     # Signup page
│   ├── colleges/
│   │   ├── page.tsx            # Listing + search + filters
│   │   └── [id]/page.tsx       # College detail page
│   ├── compare/page.tsx        # Side-by-side comparison
│   ├── saved/page.tsx          # Saved colleges + comparisons
│   ├── layout.tsx              # Root layout (Navbar, CompareBar)
│   └── globals.css             # Design tokens + Tailwind import
│
├── components/
│   ├── ui/                     # Primitive, domain-agnostic components
│   │   ├── Button.tsx          # 5 variants × 4 sizes, loading state, icon slots
│   │   ├── Badge.tsx           # 6 color variants, optional dot indicator
│   │   ├── Card.tsx            # Hoverable, accent-border, sub-components
│   │   ├── Input.tsx           # Label, error, hint, icon slots
│   │   ├── Modal.tsx           # Focus-trapped, Escape-key, scroll-lock
│   │   ├── RatingBadge.tsx     # Tier-aware (Elite / Top / Good / Ranked)
│   │   └── Skeleton.tsx        # Grid card + list card loading skeletons
│   │
│   ├── layout/
│   │   └── Navbar.tsx          # Sticky nav with live compare count badge
│   │
│   ├── college/                # College listing feature components
│   │   ├── CollegeCard.tsx     # Grid card + list row card variants
│   │   ├── CollegeGrid.tsx     # Switches view mode, renders correct skeleton
│   │   ├── SortBar.tsx         # Sort dropdown + grid/list toggle
│   │   ├── ActiveFilters.tsx   # Removable chip bar for applied filters
│   │   ├── Pagination.tsx      # Page controls with ellipsis logic
│   │   └── EmptyState.tsx      # Zero-result state with clear CTA
│   │
│   ├── search/
│   │   ├── SearchBar.tsx       # Debounced input with clear button
│   │   └── FilterSidebar.tsx   # Desktop sticky sidebar + mobile drawer
│   │
│   ├── detail/                 # College detail page sections
│   │   ├── DetailHero.tsx      # Gradient hero, stats, save/compare actions
│   │   ├── SectionNav.tsx      # Sticky scroll-spy tab nav
│   │   ├── SectionWrapper.tsx  # Scroll anchor + section header
│   │   ├── OverviewSection.tsx # About, facilities, scholarships, rating bars
│   │   ├── CoursesSection.tsx  # Accordion cards with department filter
│   │   ├── PlacementsSection.tsx # SVG donut chart, recruiter grid, salary bar
│   │   └── ReviewsSection.tsx  # Star distribution, sortable reviews, helpful voting
│   │
│   ├── compare/
│   │   ├── CompareBar.tsx      # Sticky bottom bar, placeholder slots
│   │   ├── ComparePicker.tsx   # Dropdown to add a college to comparison
│   │   └── CompareTable.tsx    # Scrollable table with best-value highlighting
│   │
│   ├── saved/
│   │   └── SavedSection.tsx    # Tabbed saved colleges + saved comparisons
│   │
│   └── auth/
│       ├── AuthForm.tsx        # Login/signup form with validation
│       └── AuthShell.tsx       # Two-column auth layout wrapper
│
├── store/                      # Zustand global stores
│   ├── useAuthStore.ts         # User session (mocked, persisted)
│   ├── useCompareStore.ts      # Up to 3 selected college IDs
│   └── useSavedStore.ts        # Saved college IDs + named comparisons
│
├── hooks/
│   ├── useColleges.ts          # Filter, sort, paginate college list
│   ├── useDebounce.ts          # Debounce hook (250 ms default)
│   └── useSavedItems.ts        # Derived hook for saved page data
│
├── lib/
│   ├── mock-data.ts            # 20 college records with full metadata
│   ├── detail-data.ts          # Rich detail data (courses, placements, reviews)
│   ├── compare-data.ts         # `toComparableCollege` mapper + row definitions
│   ├── auth-validation.ts      # Form validation + password strength scoring
│   ├── constants.ts            # MAX_COMPARE, sort/filter option arrays
│   └── utils.ts                # `cn`, `formatCurrency`, `formatPercent`, etc.
│
└── types/
    └── college.ts              # All shared TypeScript interfaces and types
```

---

## Setup

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/college-finder.git
cd college-finder

# 2. Install dependencies
npm install
```

No environment variables are required. The project is entirely frontend with no API keys or `.env` files.

---

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects from `/` to `/colleges` automatically.

**Demo account** (on the login page):
- Email: `student@example.com`
- Password: `College123`

Or click **Fill demo credentials** on the login form.

---

## Building for Production

```bash
# Type-check, lint, and build
npm run build

# Preview the production build locally
npm start
```

A successful build produces zero TypeScript errors and a fully static-compatible output.

---

## Architecture Decisions

**App Router over Pages Router.** Next.js 15's App Router enables React Server Components for static data, co-locates layouts next to their routes, and uses the file-system as the navigation API — keeping the project structure self-documenting.

**Zustand over React Context.** Context re-renders every consumer on any state change. Zustand's selector-based subscriptions mean only the components that read a specific slice re-render. Three stores (`auth`, `compare`, `saved`) each handle a single concern and persist to `localStorage` via the built-in middleware.

**`useColleges` hook as the single source of truth for the listing page.** All filter, sort, search, and pagination logic lives in one hook. The page component is a pure coordinator — it reads state and passes callbacks; it contains no business logic itself.

**CSS custom properties for the design system.** Design tokens (`--sapphire`, `--cloud`, `--radius-lg`, etc.) are defined once in `globals.css` and referenced throughout via Tailwind's arbitrary-value syntax (`bg-[var(--sapphire)]`). Changing a token updates every component that uses it simultaneously.

**Mock data separated by concern.** `mock-data.ts` contains the flat college list (used by listing and compare). `detail-data.ts` contains rich per-college data (courses, placements, reviews) that would come from a detail API endpoint in production. This separation means the listing page never loads heavyweight detail data it doesn't need.

---

## Responsive Design

The layout follows a mobile-first approach throughout. Key breakpoints:

| Breakpoint | Behaviour |
|---|---|
| Default (mobile) | Single-column card grid; filter panel hidden behind a slide-up drawer; list-card stats visible inline; compact navbar |
| `sm` (640px) | Two-column grid; list card shows desktop stat columns |
| `lg` (1024px) | Three-column grid; filter sidebar permanently visible; auth layout switches to two-column |

Specific mobile UX decisions:
- The **filter drawer** slides up from the bottom on mobile and uses a full-height backdrop, matching native sheet patterns rather than a sidebar that would eat screen width.
- The **CompareBar** always shows the college chips and action buttons, but truncates long college names gracefully.
- The **SectionNav** on detail pages uses `overflow-x-auto` to scroll horizontally on narrow screens rather than wrapping or hiding tabs.

---

## Reusable Component Strategy

Components are split into two layers:

**Primitive UI components** (`components/ui/`) are completely domain-agnostic. They accept explicit props for every variant and have no knowledge of colleges, comparisons, or auth. Adding a new feature never requires touching these files — only composing them.

**Feature components** (`components/college/`, `components/detail/`, etc.) own their domain logic and compose the primitives. They may read from Zustand stores directly but never manage server state.

Patterns used consistently across components:
- **Variant maps** — a `Record<VariantName, string>` maps variant names to Tailwind class strings. Adding a variant is one line.
- **`cn()` utility** — a lightweight class merger (wraps `Array.filter(Boolean).join(" ")`) used everywhere to conditionally apply classes without string concatenation.
- **Icon-as-ReactNode slots** — `Button`, `Input`, and `SearchBar` accept `leftIcon`/`rightIcon` as `React.ReactNode`, so any icon or emoji can be passed without modifying the component.
- **Skeleton co-location** — each skeleton variant lives in `Skeleton.tsx` and mirrors the layout of its real component, ensuring loading states match the final render exactly.

---

## State Management

| Store | Persisted | Contents |
|---|---|---|
| `useAuthStore` | ✅ `localStorage` | `user`, `isLoggedIn`, `login()`, `signup()`, `logout()` |
| `useCompareStore` | ✅ `localStorage` | `selectedIds: string[]` (max 3), `add()`, `remove()`, `clear()` |
| `useSavedStore` | ✅ `localStorage` | `savedCollegeIds: string[]`, `savedComparisons: SavedComparison[]`, and CRUD methods |

Server state (the college list) is not stored in Zustand — it lives in `lib/mock-data.ts` and is filtered/sorted in the `useColleges` hook using `useMemo`. In a real application this would be replaced with React Query or SWR fetching from a REST or GraphQL API, with no changes needed to the component layer.

---

## Future Improvements

**Backend integration.** Replace `mock-data.ts` with API calls using React Query (`@tanstack/react-query`). The `useColleges` hook interface would remain identical — only its internal data source changes.

**Real authentication.** Swap the mocked `useAuthStore` for NextAuth.js or a JWT-based flow. Route protection would move to a Next.js middleware file rather than client-side guards.

**Advanced filters.** Add SAT range slider, enrollment size filter, and program-specific ranking filters. The `FilterState` type and `useColleges` hook are already structured to accept additional filter keys with minimal changes.

**Print / PDF export.** Add a `print:` Tailwind variant stylesheet and a "Download comparison as PDF" button on the compare page using the browser's native `window.print()`.

**Internationalisation.** Wrap currency and number formatting (already using `Intl.NumberFormat`) with a locale context to support non-USD tuition figures and non-English interfaces.

**Cypress E2E tests.** The clean separation between UI components and Zustand stores makes the app straightforward to test: seed the stores, render a page, and assert on the DOM.

---

## License

MIT — free to use, modify, and distribute.
=======
