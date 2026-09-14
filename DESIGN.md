# Design Brief

## Direction

Chrono Vault — a retro-futuristic time-capsule interface for writing messages sealed until a future unlock moment.

## Tone

Dark celestial / temporal — deep space-blue surfaces with a cyan "locked" glow and a warm amber "unlocked" glow, executed with editorial restraint.

## Differentiation

Locked capsules breathe with a cyan temporal pulse and mono-font countdowns, while unlocked capsules shift to a warm amber glow — color encodes time itself.

## Color Palette

| Token      | OKLCH       | Role                              |
| ---------- | ----------- | --------------------------------- |
| background | 0.13 0.022 250 | deep space blue base           |
| foreground | 0.93 0.01 250 | primary text                   |
| card       | 0.165 0.026 250 | glassy capsule surface        |
| primary    | 0.72 0.14 205 | temporal cyan — locked/CTA     |
| accent     | 0.78 0.15 80 | amber gold — unlocked/reveal    |
| muted      | 0.21 0.03 250 | secondary surface              |
| border     | 0.28 0.03 250 | hairline capsule edges          |

## Typography

- Display: Space Grotesk — headings, hero, capsule titles
- Body: DM Sans — UI labels, paragraphs, form text
- Mono: JetBrains Mono — countdown digits, timestamps
- Scale: hero `text-4xl md:text-5xl font-bold tracking-tight`, h2 `text-2xl font-semibold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Layered glassy cards over a near-black starfield (`starfield` radial-dot utility), with hairline borders and soft cyan/amber glow shadows (`shadow-glow-cyan`, `shadow-glow-amber`) reserved for active and unlocked states; gradient tokens `--gradient-primary` / `--gradient-subtle` power text and surface accents.

## Structural Zones

| Zone    | Background   | Border   | Notes                          |
| ------- | ------------ | -------- | ------------------------------ |
| Header  | bg-background | border-b | sticky, logo + Create CTA      |
| Content | bg-background | —        | card grid, alternate muted rows |
| Footer  | bg-muted/40  | border-t | status hint, demo note          |

## Spacing & Rhythm

Mobile-first single column with generous `gap-6` section rhythm, `p-5` card padding, and `space-y-3` micro-grouping inside cards; content max-width `max-w-md` centered.

## Component Patterns

- Buttons: rounded-lg, primary cyan glow for Create Capsule, subtle hover lift
- Cards: rounded-2xl glassy surface, hairline border, glow shadow by state
- Badges: rounded-full pill, cyan for locked / amber for unlocked

## Motion

- Entrance: cards `animate-card-in` staggered 0.4s; page fades in `animate-fade-in`
- Hover: interactive elements lift + glow intensify over 0.3s (`transition-smooth`)
- Decorative: locked capsules `animate-pulse-soft` on the lock icon; countdown ticks each second; hero/empty-state icon `animate-float`

## Constraints

- Dark mode only; neon glow used sparingly on active/unlocked states
- Mobile-first responsive; single-column on mobile, wider grid on md+
- Demo/local data only — no accounts, no cross-session persistence
- Do not build delete/edit capsule or share-via-link flows

## Signature Detail

The countdown digits render in JetBrains Mono with a soft cyan glow that "breathes" each second, and the entire capsule flips to a warm amber reveal the moment it unlocks.
