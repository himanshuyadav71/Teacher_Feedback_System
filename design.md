# Teacher Feedback System - Design Style Guide

## Design Philosophy

### Color Palette
- **Primary**: Deep Navy (#1e3a8a) - Trust, professionalism, academic authority
- **Secondary**: Soft Blue (#3b82f6) - Interactive elements, progress indicators
- **Accent**: Warm Amber (#f59e0b) - Success states, highlights, call-to-action
- **Neutral**: Cool Gray (#6b7280) - Text, borders, subtle backgrounds
- **Background**: Pure White (#ffffff) - Clean, academic feel
- **Success**: Emerald (#10b981) - Confirmation messages, completed states
- **Warning**: Orange (#f97316) - Alerts, important notices

### Typography
- **Display Font**: "Inter" - Modern, clean sans-serif for headings and UI elements
- **Body Font**: "Inter" - Consistent typography system for optimal readability
- **Monospace**: "JetBrains Mono" - For data displays and technical content
- **Font Sizes**: 
  - Hero: 3.5rem (56px)
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)

### Visual Language
- **Minimalist Academic**: Clean, uncluttered interface focusing on functionality
- **Trust-Building**: Professional color scheme and consistent spacing
- **Accessibility-First**: High contrast ratios and clear visual hierarchy
- **Modern Tech**: Subtle shadows, rounded corners, smooth transitions

## Visual Effects & Styling

### Used Libraries
- **Anime.js**: Smooth micro-interactions and form transitions
- **ECharts.js**: Interactive data visualizations for admin dashboard
- **Typed.js**: Dynamic text effects for hero sections
- **Splide.js**: Image carousels and content sliders
- **p5.js**: Background particle effects and creative coding elements

### Animation Effects
- **Text Effects**: 
  - Typewriter animation for hero headings
  - Color cycling emphasis on key metrics
  - Split-by-letter stagger for section titles
- **Background**: 
  - Subtle particle system using p5.js
  - Gradient flow animation on hero sections
- **Interactions**:
  - Smooth hover transitions on buttons and cards
  - Progress bar animations for form completion
  - Loading states with skeleton screens

### Header & Navigation Effect
- **Sticky Navigation**: Smooth scroll-based opacity changes
- **Logo Animation**: Subtle scale and glow effects on hover
- **Menu Transitions**: Slide-in animations for mobile menu
- **Active States**: Underline animations for current page indicators

### Component Styling
- **Cards**: Soft shadows with hover elevation effects
- **Buttons**: Gradient backgrounds with smooth hover transitions
- **Forms**: Floating labels with focus animations
- **Data Tables**: Alternating row colors with hover highlights
- **Charts**: Interactive tooltips and smooth data transitions

### Responsive Design
- **Mobile-First**: Optimized for touch interactions
- **Breakpoints**: 
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+
- **Flexible Grid**: CSS Grid and Flexbox for adaptive layouts
- **Touch Targets**: Minimum 44px for all interactive elements

### Accessibility Features
- **Color Contrast**: Minimum 4.5:1 ratio for all text
- **Focus Indicators**: Clear keyboard navigation outlines
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Motion Preferences**: Respect user's reduced motion settings