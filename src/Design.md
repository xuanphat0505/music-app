---
name: Lumina Glass
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#ffb0cd'
  on-secondary: '#640039'
  secondary-container: '#aa0266'
  on-secondary-container: '#ffbad3'
  tertiary: '#ffb784'
  on-tertiary: '#4f2500'
  tertiary-container: '#a15100'
  on-tertiary-container: '#ffe0cd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#ffd9e4'
  secondary-fixed-dim: '#ffb0cd'
  on-secondary-fixed: '#3e0022'
  on-secondary-fixed-variant: '#8c0053'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb784'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 20px
  stack-gap: 16px
  item-gap: 12px
  glass-margin: 8px
---

## Brand & Style
This design system focuses on an **Ultra-Premium Dark Glassmorphism** aesthetic tailored for high-fidelity audio experiences. The brand personality is immersive, sleek, and futuristic, aiming to make the interface feel like a sophisticated physical object made of dark obsidian and frosted glass.

The design leverages deep layering and background blurs to create a sense of infinite depth. It is intended for a tech-savvy audience that appreciates high-end industrial design and cinematic interfaces. The emotional response should be one of "quiet luxury"—where the interface recedes to let the album art and music become the focal point.

## Colors
The palette is rooted in a deep **Dark Slate Grey (#0B0F19)** base which acts as the "void" background. 

- **Primary & Secondary:** A vibrant gradient pairing of Deep Purple and Electric Pink is reserved for high-energy interactions (play buttons, active states, progress bars). 
- **Glass Surfaces:** Elements use a translucent white fill (approx. 5-8% opacity) combined with a high-strength background blur (20px-40px).
- **Accents:** Use the Electric Pink sparingly for notifications or "live" indicators to maintain the premium feel.

## Typography
The system utilizes a dual-font approach to balance character with utility.

- **Outfit** is used for headings and display titles. Its geometric nature complements the rounded glass panels and provides a modern, premium "tech" feel.
- **Inter** is used for all functional text, track metadata, and navigation labels. Its high x-height ensures legibility against complex, blurred backgrounds.
- **Hierarchy:** Use "High Emphasis" (White, 90% opacity) for titles and "Medium Emphasis" (Slate-200, 60% opacity) for artist names and secondary info.

## Layout & Spacing
The layout follows a fluid-width model with generous internal safe areas to prevent the "glass" edges from feeling cramped.

- **Grid:** A standard 4-column mobile grid with 20px side margins.
- **Rhythm:** An 8px linear scale is used. Most containers should have 16px or 24px internal padding to maintain the "airy" glass aesthetic.
- **Safe Areas:** Ensure the "Now Playing" glass bar has at least 32px of clearance from the bottom navigation to prevent visual clutter.

## Elevation & Depth
Depth is not communicated via traditional drop shadows, but through **Refractive Layering**:

1.  **Level 0 (Base):** Dark Slate Grey background (#0B0F19).
2.  **Level 1 (Cards):** 5% White fill, 20px Background Blur, 1px White border (10% opacity).
3.  **Level 2 (Modals/Overlays):** 10% White fill, 40px Background Blur, 1px White border (20% opacity).
4.  **Glows:** Subtle, large-radius radial gradients of Primary Purple (#7C3AED) are placed *behind* glass layers to indicate focus or active playback, creating a "neon underglow" effect.

## Shapes
The design system uses a consistent **Rounded** language to soften the futuristic aesthetic and make it feel approachable.

- **Containers:** Standard cards and glass panels use `rounded-lg` (16px).
- **Control Elements:** Play buttons and search bars use `rounded-xl` (24px) or full pill shapes to distinguish them from content containers.
- **Album Art:** Should always maintain a `rounded-lg` (16px) corner radius to match the UI containers.

## Components

### Buttons
- **Primary:** Gradient fill (Purple to Pink), white text, no border. Heavy outer glow on hover/active.
- **Secondary (Glass):** Frosted glass fill, 1px translucent border, white text.

### Glass Cards
- Used for album lists and artist profiles. The background blur must be high enough that text remains legible even when scrolling over vibrant album covers.

### Inputs
- Search bars should be pill-shaped with a 10% white fill and a "Search" icon using a thin 1.5pt stroke.

### Playback Controls
- Use minimalist, thin-line icons (1.5pt stroke). The "Play" button should be the primary focal point, often using a solid gradient fill to break the glass aesthetic and signal importance.

### Progress Bars
- Background track: 20% white opacity.
- Progress fill: Linear gradient from Primary Purple to Secondary Pink.
- Thumb: A solid white circle with a subtle glow.