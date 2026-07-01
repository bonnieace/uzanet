---
name: Technical Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#00201c'
  on-tertiary-container: '#009485'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#71f8e4'
  tertiary-fixed-dim: '#4fdbc8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  h3:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  mono-label:
    fontFamily: monospace
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  table-header:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  container-max: 1440px
---

## Brand & Style

This design system is built for the high-stakes environment of ISP infrastructure management. The brand personality is authoritative, systematic, and ultra-reliable. It balances a "Technical Modernism" aesthetic—utilizing high-density information layouts with a minimalist skin to ensure that administrative complexity does not lead to cognitive overload.

The visual style leverages a "Utility-First" approach:
- **Minimalist Density:** Maximizing screen real estate for data tables and network monitoring without feeling cluttered.
- **Subtle Layering:** Using structural borders rather than heavy shadows to define functional zones.
- **Atmospheric Professionalism:** A dark-leaning or sophisticated light-mode palette that feels like a command center.

## Colors

The palette is anchored in **Slate** and **Deep Navy** to establish a foundation of stability. 
- **Primary:** A deep Slate-900 used for headers, primary navigation, and heavy text to instill a sense of "infrastructure."
- **Accents:** Electric Blue (Sky-500) and Teal-500 are reserved exclusively for interactive states, progress indicators, and data visualizations to draw the eye toward actionable insights.
- **Neutrals:** A range of Cool Grays (Slate series) manages the hierarchy of borders and secondary information.
- **Semantic Colors:** High-saturation Green, Amber, and Red are used sparingly for status indicators (e.g., "Node Online", "Payment Pending", "Outage") to ensure immediate recognition within dense tables.

## Typography

This design system utilizes **Inter** for its exceptional legibility in data-heavy environments. The typeface is optimized for small sizes, which is critical for the dense tables and dashboards inherent in ISP billing.

- **Vertical Rhythm:** A strict 4px baseline grid ensures alignment across multi-column layouts.
- **Data Display:** For IP addresses, MAC addresses, and technical IDs, use a secondary monospaced font (or Inter's tabular lining figures) to ensure character alignment.
- **Hierarchy:** Use font weight rather than size to differentiate information levels, keeping font sizes relatively small (12px–14px) to maximize data density.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. The sidebar remains fixed at 240px, while the main content area utilizes a 12-column fluid grid for dashboard widgets and tables.

- **Density Management:** A compact 8px padding is the standard for table cells and list items. 
- **Sectioning:** Content is grouped into "cards" or "panels" with 24px margins between major groups.
- **Horizontal Alignment:** Data columns in tables should be strictly aligned—numerical data is right-aligned, while text data is left-aligned for rapid scanning.

## Elevation & Depth

To maintain a "technical" feel, elevation is primarily conveyed through **Tonal Layering** and **Low-Contrast Outlines** rather than soft shadows.

- **Surface Levels:** The background canvas is Slate-50. Secondary panels use white (#FFFFFF). Active or hovering elements use a subtle tint of the primary color.
- **Borders:** Use 1px solid borders (#E2E8F0) to define sections. This creates a "blueprint" feel that fits an ISP's technical nature.
- **Shadows:** When necessary (e.g., for dropdowns or modals), use a single "Sharp Shadow"—a tight, 2px blur with 10% opacity to prevent the UI from looking too "dreamy" or consumer-focused.

## Shapes

The shape language is "Soft" (4px - 8px), providing just enough rounding to feel modern without losing the professional, rigid feel of a technical tool.

- **Standard Components:** Buttons, inputs, and cards use a 4px (0.25rem) radius.
- **Status Pills:** Small chips or status indicators use a full pill radius to distinguish them from interactive buttons.
- **Charts:** Bar charts should have slight 2px rounding on top edges to soften the data visualization.

## Components

### Data Tables
The core of this design system. Tables must feature sticky headers, hover states for rows, and condensed vertical padding. Action icons (edit, delete, view) appear in the final column on hover to reduce visual noise.

### Stat Cards
Dashboard cards featuring a large "Primary Metric" (e.g., "Active Subscribers"), a small sparkline chart showing the 7-day trend, and a percentage change indicator (Green/Red).

### Filter Bars
A horizontal bar above tables containing a search input (with a ⌘K shortcut hint), a date range picker, and a "Status" multi-select dropdown.

### Input Fields
Inputs use a "Fixed Label" style (label above the field). Focus states utilize a 2px Electric Blue outer glow and a Slate-900 border.

### Search Inputs
A global search bar in the header with a distinctive Slate-100 background and a subtle magnifying glass icon, acting as the primary navigation tool for finding customer accounts or equipment IDs.

### Modern Charts
Using the teal and blue accents, charts should be "clean-line" with minimal grid lines. Tooltips should be dark (Slate-900) with white text for high-contrast reading of specific data points.