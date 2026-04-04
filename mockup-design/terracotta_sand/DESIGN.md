# Design System: Editorial Sneaker Commerce

## 1. Overview & Creative North Star: "The Tactile Curator"

The digital landscape for sneakers is often cluttered, loud, and driven by urgency. This design system rejects that noise in favor of **"The Tactile Curator."** Our Creative North Star treats the mobile web shop not as a retail grid, but as a high-end editorial lookbook. 

The aesthetic is rooted in **Organic Brutalism**: we use the structural strength of heavy typography and large product isolation, but soften it through a warm, "Sand & Terracotta" palette and expansive white space. We break the "template" look by utilizing intentional asymmetry—allowing product images to bleed off-screen or overlap container edges—to create a sense of physical depth and motion.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule

Our palette moves away from sterile whites to a lived-in, premium warmth. We use the Material Design token logic to create a sophisticated hierarchy.

### The Palette
- **Primary (`#9B3F1C`):** A deep terracotta for high-intent actions. 
- **Surface & Background (`#FBF9F5` / `#F5F3EF`):** The foundation. These warm tones prevent eye strain and feel more like premium cardstock than a digital screen.
- **Secondary/Success (`#52652A`):** An olive green used for "In Stock" markers and sustainability badges.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts or tonal transitions.
- To separate a "Featured" section from the "New Arrivals" list, shift from `surface` to `surface-container-low`.
- **Nesting Hierarchy:** Use `surface-container-lowest` (`#FFFFFF`) for product cards to make them "pop" against the `surface-container` (`#F0EEEA`) page background.

### Glass & Gradient Soul
To move beyond a flat UI, use **Glassmorphism** for bottom navigation bars and floating filters:
- **Token:** `surface` at 80% opacity with a 20px backdrop-blur.
- **Signature Gradient:** For primary CTAs, apply a subtle linear gradient from `primary` (`#9B3F1C`) to `primary_container` (`#BB5732`) at a 135-degree angle. This adds a "weighted" feel to the button that flat hex codes cannot achieve.

---

## 3. Typography: Editorial Authority

We use **Manrope** across the board, relying on its geometric but friendly grotesk qualities to convey high-end precision.

| Token | Size | Weight | Use Case |
| :--- | :--- | :--- | :--- |
| **display-lg** | 3.5rem | 800 | Limited edition drop titles. |
| **headline-md** | 1.75rem | 700 | Category headers (e.g., "The Autumn Collection"). |
| **title-lg** | 1.375rem | 600 | Product names in detail views. |
| **body-lg** | 1rem | 400 | Product descriptions; high readability. |
| **label-md** | 0.75rem | 600 | Metadata (e.g., "Size", "SKU", "Price"). |

**Creative Execution:** Use `display-lg` with tight letter-spacing (-0.04em) and `textPrimary`. Pair it with `body-md` in `textSecondary` for a clear, high-contrast editorial hierarchy.

---

## 4. Elevation & Depth: The Layering Principle

We achieve depth through **Tonal Layering** rather than traditional drop shadows.

- **The Stacking Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. The slight shift in "warmth" creates a soft, natural lift.
- **Ambient Shadows:** For floating "Add to Cart" sheets, use a shadow with a 40px blur and 6% opacity. The shadow color should be a tint of our terracotta (`#9B3F1C`) rather than black, mimicking how light reflects off colored materials.
- **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline-variant` at 15% opacity. Never use a 100% opaque border.

---

## 5. Components: Minimalist Primitives

### Buttons
- **Primary:** High-roundedness (`xl: 1.5rem`). Background: `primary` gradient. Text: `on_primary` (White). No border.
- **Tertiary:** No background. Underlined text using `primary` at 2px weight, offset by 4px.

### Product Cards
- **Construction:** Use `surface-container-lowest` with `xl` (1.5rem) corner radius.
- **Rule:** Forbid divider lines. Use `spacing-lg` (vertical white space) to separate the product image from the price/title metadata. 
- **Isolation:** The sneaker should be "isolated" (PNG) with a very subtle `primary_fixed` (`#FFDBCF`) circular glow behind it to give it an aura of importance.

### Chips (Filters)
- **State:** Unselected chips use `surface-container-high` with no border. Selected chips switch to `primary` with `on_primary` text. This high-contrast flip makes the active state unmistakable.

### Input Fields
- **Styling:** Use a `surface-variant` background with a bottom-only 2px "Ghost Border." When focused, the border transitions to `primary` terracotta.

### Additional Signature Component: "The Story Carousel"
Instead of a standard image slider, use a layout where the image occupies 80% of the screen width, allowing the next image to "peek" in. Use `display-sm` typography to overlay the product name across the image boundary to break the grid.

---

## 6. Do’s and Don'ts

### Do:
- **Do** allow product images to break the container. If a sneaker is facing right, let the toe-box overlap the card's right padding.
- **Do** use `successState` (`#4A5D23`) sparingly for "In Stock" or "Verified Authentic" tags to maintain the high-end feel.
- **Do** leverage wide margins (at least 24px) on mobile to give the content room to breathe.

### Don't:
- **Don't** use pure black (`#000000`). It is too aggressive for this palette; always use `textPrimary` (`#2D2B2A`).
- **Don't** use standard "Drop Shadows" (0, 4, 10, 0). They feel like templates. Use the Ambient Shadow rule.
- **Don't** use icons with thin 1px strokes. Use solid or 2px "Duotone" icons to match the weight of the Manrope typeface.