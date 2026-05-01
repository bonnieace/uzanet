---
name: Uzanet Modern
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
  on-surface-variant: '#424656'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737687'
  outline-variant: '#c2c6d9'
  surface-tint: '#0053da'
  primary: '#004cca'
  on-primary: '#ffffff'
  primary-container: '#0062ff'
  on-primary-container: '#f3f3ff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#9e3100'
  on-tertiary: '#ffffff'
  tertiary-container: '#c84000'
  on-tertiary-container: '#fff1ed'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59c'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832700'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 480px
---

## Brand & Style
The brand personality for Uzanet Hotspot is built on the pillars of **reliability**, **velocity**, and **simplicity**. It targets a mobile-first audience that needs immediate, friction-less internet access. 

The design style follows a **Corporate Modern** aesthetic. It moves away from the flat, dated appearance of the original screens toward a premium interface characterized by soft depth, high-quality typography, and a "utility-first" layout. The interface should feel like a native system utility rather than a webpage, using subtle gradients and refined shadows to establish a clear visual hierarchy.

## Colors
The palette is centered around a **Vibrant Electric Blue** (#0062FF), which evolves the original blue into a more modern, high-contrast shade that signifies connectivity. 

- **Primary:** Used for the main action buttons and active states.
- **Secondary:** A deep slate for high-level headings and critical text.
- **Surface:** The background uses a very light cool-grey (#F8FAFC) to reduce glare and differentiate from white card components.
- **Functional:** A semantic palette (Green/Red/Amber) handles system status feedback, ensuring users clearly understand when a payment is successful or if a connection error has occurred.

## Typography
This design system pairs **Manrope** for headlines with **Inter** for UI elements. 

Manrope provides a modern, balanced geometric feel for titles and pricing numbers, making them feel premium and easy to read at a glance. Inter is used for all functional text, inputs, and labels due to its exceptional legibility on small mobile screens. Tracking is slightly tightened on headlines to create a punchier, more professional appearance.

## Layout & Spacing
The layout uses a **contextual no-grid approach** optimized for a single-column mobile view. Since the hotspot portal is primarily accessed via smartphones, all main components are centered in a container with a maximum width of 480px.

A strict **8px spatial rhythm** governs the margins and padding. Content blocks are grouped logically: pricing cards are separated from the login form by a wide gap (`xl`) to prevent accidental taps, while internal card elements use tighter spacing (`sm` to `md`) to indicate relationship.

## Elevation & Depth
Elevation is communicated through **ambient shadows** and subtle tonal shifts. 

The primary canvas is flat. Interactive "Ticket" cards and the "Login" modal use a soft, multi-layered shadow (0px 4px 20px rgba(0, 0, 0, 0.05)) to appear lifted. When a user interacts with a pricing card, the shadow should deepen slightly to indicate focus. Loading states should use a shimmering skeleton screen effect that follows these elevation rules, maintaining the perceived depth even before content is loaded.

## Shapes
The shape language is consistently **Rounded**. 

- **Primary Cards:** Use `rounded-xl` (1.5rem / 24px) to create a friendly, modern container feel.
- **Buttons & Inputs:** Use `rounded-lg` (1rem / 16px) to provide a comfortable touch target that feels approachable.
- **Status Pills:** Use a full pill shape for small labels (like "Most Popular" or "Connected").

These rounded corners eliminate the "harshness" of the original design, making the portal feel like a high-end service.

## Components

### Pricing Cards
Pricing options should be presented as vertical cards with high-contrast icons at the top. The price (e.g., "Ksh 10") should be the largest typographic element, using the Primary Blue color.

### Primary Buttons
Buttons should be full-width on mobile. Use a subtle vertical gradient (Primary Blue to a slightly darker shade) to give them a tactile, "pressable" feel. The label should be in white, semi-bold Inter.

### Input Fields
Inputs should feature a light grey border that turns Primary Blue on focus. Use a large touch area (minimum 48px height) with placeholder text in Neutral Slate.

### Success & Error States
- **Success:** Use a centered modal or top-toast with a success-green checkmark and a clear "Continue" button.
- **Error:** Inline error text should appear directly below the relevant input field in error-red, using `body-sm`.
- **Loading:** Use a circular progress indicator in the primary blue color, centered within the button or as a full-screen overlay if the delay is expected to be more than 2 seconds.