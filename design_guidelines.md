# Design Guidelines: GameZone Arena - Gaming Cafe Availability Viewer

## Design Approach: Gaming-Tech Hybrid
**Selected Approach:** Reference-based design inspired by gaming platforms (Steam, Discord) combined with modern mobile app patterns (Airbnb listing details, Spotify)

**Key Principles:**
- Dark-first design with vibrant accent highlights
- Gaming aesthetic without being overwhelming
- Information density balanced with readability
- Mobile-optimized card-based layouts

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background Base: 220 15% 8% (deep slate)
- Surface/Card: 220 12% 12% (elevated cards)
- Border: 220 10% 18% (subtle dividers)
- Primary Accent: 270 80% 65% (vibrant purple for availability badges)
- Secondary Accent: 210 90% 60% (electric blue for interactive elements)
- Success: 140 65% 55% (available status)
- Warning: 35 85% 60% (limited availability)
- Text Primary: 0 0% 95%
- Text Secondary: 220 10% 65%

### B. Typography

**Font Stack:**
- Primary: Inter (Google Fonts) - clean, modern sans-serif
- Headings: 'Rajdhani' or 'Chakra Petch' for gaming aesthetic headers
- Body: Inter for readability

**Sizes & Hierarchy:**
- Page Title: text-2xl font-bold (cafe name)
- Section Headers: text-lg font-semibold
- Body Text: text-sm
- Captions/Meta: text-xs
- Ratings/Badges: text-xs font-medium

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 3, 4, 6, 8, and 12
- Card padding: p-4 or p-6
- Section spacing: space-y-4 or space-y-6
- Grid gaps: gap-3 or gap-4
- Button padding: px-6 py-3

**Container:**
- Mobile-first: Full width with px-4 gutter
- Max content width: No max-width constraint for mobile

### D. Component Library

**1. Header Card:**
- Cafe name, rating star badge (270 80% 65% background), distance indicator
- Location text with subtle icon
- Rounded-xl card with surface background
- Compact padding (p-4)

**2. Availability Cards:**
- Grid layout: grid-cols-2 gap-3
- Each card: Gaming station type (PC, PS5, VR, Racing Sim)
- Availability count badge: Large, bold number with "Available" text
- Status indicator: Small dot (success green or warning amber)
- Icon representation for each gaming type
- Hover state: Subtle scale or glow effect

**3. Game Tags/Chips:**
- Pill-shaped: rounded-full px-3 py-1.5
- Dark background with light border (220 10% 18%)
- Text: text-xs
- Organized by platform category with section headers
- Grid layout: flex flex-wrap gap-2

**4. Amenities Grid:**
- 4-column grid: grid-cols-4 gap-4
- Icon + label vertical stack
- Icons: Heroicons (solid style, w-6 h-6)
- Purple accent for icons (270 80% 65%)
- Center-aligned text-xs labels

**5. About Section:**
- Text block with secondary text color
- Leading relaxed (leading-relaxed)
- Contained in card with p-4

**6. Action Buttons (Bottom Bar):**
- Fixed bottom bar: 3-column grid (Call, WhatsApp, Map)
- Icon + label vertical stack
- Border-top separator
- Interactive states: Active background highlight
- Use brand colors: Phone (blue), WhatsApp (green 140 65% 55%), Map (purple)

**7. Navigation/Back Button:**
- Top-left corner fixed or absolute
- Rounded-full background blur
- Chevron-left icon from Heroicons

### E. Visual Details

**Cards & Elevation:**
- Border: 1px solid with border color (220 10% 18%)
- Background: Surface color (220 12% 12%)
- Border-radius: rounded-xl (0.75rem)
- No harsh shadows, use subtle borders instead

**Badges & Indicators:**
- Status dots: w-2 h-2 rounded-full with appropriate color
- Number badges: Bold text with colored background, rounded-md
- Rating star: Gold/yellow (45 90% 60%) with star icon

**Icons:**
- Source: Heroicons (solid for filled, outline for strokes)
- Consistent sizing: w-5 h-5 for inline, w-6 h-6 for features
- Color: Accent purple for primary actions, secondary text for informational

## Images

**No hero image required.** This is a detail/listing view focused on data display.

**Optional Enhancement Images:**
- Small thumbnail/header image of the cafe (aspect-ratio 16:9, rounded corners)
- Positioned above or integrated with header card
- Gaming setup photos in a carousel below about section (if implementing gallery feature)

## Layout Structure (Mobile)

1. **Back Button** (top-left, overlay)
2. **Cafe Header Card** (name, rating, location)
3. **Availability Grid** (2x2 or 2x3 gaming stations)
4. **About Section Card**
5. **Games Section** (categorized chip lists)
6. **Amenities Grid** (4-column icons)
7. **Fixed Bottom Action Bar** (Call, WhatsApp, Map)

## Animations

**Minimal, Performance-Focused:**
- Card hover: `transition-transform duration-200` with slight scale (scale-105)
- Button press: Active state with opacity reduction
- Page transitions: Simple fade-in
- NO complex animations or parallax effects

## Accessibility

- Maintain WCAG AA contrast ratios on dark backgrounds
- Touch targets: Minimum 44x44px for all interactive elements
- Clear focus states with visible outlines (purple accent)
- Semantic HTML with proper heading hierarchy