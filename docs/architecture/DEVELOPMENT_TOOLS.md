# Development Tools

## Graphify
**Purpose:** Graphify is used periodically to understand the repository's code structure and relationships.
**Usage Rules:**
- Use when the architecture changes substantially, adding a major subsystem, refactoring, debugging cross-module behavior, or onboarding.
- DO NOT run Graphify unnecessarily on every tiny change.
- Graphify is a development/analysis aid and must NOT be added to production runtime dependencies.

## Taste Skill
**Purpose:** Improve frontend visual quality and prevent generic AI-generated UI.
**Usage Rules:**
- Invoked to check and refine the aesthetic of React/Next.js components.
- Must work in tandem with the strict `AWESOMEDESIGN.md` rules. SatQuery's scientific correctness and professional design take priority over visual cleverness.

## Vercel Web Interface Guidelines
**Purpose:** Provide a rigorous quality/audit layer for frontend development.
**Usage Rules:**
- Use for frontend review, accessibility, UX, performance, forms, interaction states, and UI quality.
- Do not replace the SatQuery design system with generic Vercel styling.

## Playwright
**Purpose:** Meaningful end-to-end and browser interaction testing.
**Usage Rules:**
- Ensure the user interface workflows (like GeoTIFF uploading, metadata rendering) are fully tested in browser environments.
