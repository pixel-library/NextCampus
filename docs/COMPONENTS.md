# UI Component Catalog

> **Document:** `docs/COMPONENTS.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Common UI Primitives, Layout Frames, and Component Props

---

## 1. Common UI Primitives (`src/components/common/`)

### 1. `Button.jsx`
* **Purpose**: Primary interactive trigger across all forms, modals, and actions.
* **Location**: `src/components/common/Button.jsx`
* **Props**:
  - `variant`: `'primary'` (Amaranth `#AC274F`), `'secondary'` (Border sheen), `'ghost'` (Transparent text button).
  - `size`: `'sm'`, `'md'`, `'lg'`.
  - `icon`: Lucide icon component rendered left of label.
  - `loading`: Boolean showing inline loading spinner.
  - `disabled`: Boolean disabling interaction.
  - `onClick`: Event callback.

### 2. `Badge.jsx`
* **Purpose**: Compact status indicator for room availability, ticket SLA, and notification tags.
* **Location**: `src/components/common/Badge.jsx`
* **Props**:
  - `status`: `'active'` (Green/Amaranth dot), `'pending'` (Blush outline), `'resolved'` (Misty Rose pill), `'warning'`, `'info'`.
  - `children`: Text content.

### 3. `Card.jsx`
* **Purpose**: Standard elevated content container with Raisin Black surface and subtle border sheen.
* **Location**: `src/components/common/Card.jsx`
* **Props**:
  - `style`: Inline style overrides.
  - `className`: Custom CSS classes.
  - `children`: Nested elements.
  - `onClick`: Optional click callback for interactive cards.

### 4. `Input.jsx`
* **Purpose**: Form input wrapper with label, error text, and focus animation.
* **Location**: `src/components/common/Input.jsx`
* **Props**:
  - `label`: Field label string.
  - `error`: Error message string.
  - `icon`: Lucide icon rendered inside input left side.
  - Standard HTML input attributes (`type`, `value`, `placeholder`, `onChange`).

### 5. `Modal.jsx`
* **Purpose**: Backdrop-blurred overlay dialog for creating projects, editing buildings, or submitting reports.
* **Location**: `src/components/common/Modal.jsx`
* **Props**:
  - `isOpen`: Boolean controlling visibility.
  - `onClose`: Callback when backdrop or close button is clicked.
  - `title`: Header title string.
  - `children`: Dialog body content.

### 6. `Logo.jsx`
* **Purpose**: Renders the official NextCampus brand mark and optional wordmark.
* **Location**: `src/components/common/Logo.jsx`
* **Props**:
  - `size`: `'sm'`, `'md'`, `'lg'`.
  - `showText`: Boolean displaying "NextCampus" wordmark.

---

## 2. Layout Components (`src/components/layout/`)

### 1. `AppLayout.jsx`
* **Purpose**: Global frame for authenticated pages, managing sidebar, top header, content area, and mobile navigation.
* **Features**: Enforces authentication and administrative role guards.

### 2. `Sidebar.jsx`
* **Purpose**: Desktop navigation rail with role-specific item groups (Student Workspace vs Administration).
* **Width**: `240px` fixed desktop rail.

### 3. `Navbar.jsx`
* **Purpose**: Top desktop navigation bar with institutional title, global search bar, and active user profile badge.

### 4. `MobileNav.jsx`
* **Purpose**: Bottom fixed navigation drawer on mobile viewports (`<768px`).

---

## 3. Related Documentation
* [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Color and typography tokens.
* [FRONTEND.md](FRONTEND.md) — Frontend architecture.
* [RESPONSIVE_DESIGN.md](RESPONSIVE_DESIGN.md) — Grid breakpoints.
