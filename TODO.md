# TODO: Style Guide Compliance Fixes

This document outlines the necessary changes to bring the codebase into full
compliance with the style guide defined in `.github/copilot-instructions.md`.

## Priority 1: Critical Fixes (Break**Estimated Effort:** 1 hour


## Priority 7: Testing & Feature Completeness

### 7.1 Print Functionality Audit

**Status:** ❓ Needs Verification
**Impact:** User experience and accessibility
**Locations:** Print styles and media queries

**Required Changes:**

- [ ] Test printer output in light mode
- [ ] Test printer output in dark mode
- [ ] Verify background colors and images print correctly
- [ ] Consider disabling page background colors for printing
- [ ] Hide non-essential elements from print view (e.g., UI controls)
- [ ] Ensure diagram remains readable when printed
- [ ] Test print preview functionality

**Estimated Effort:** 2-3 hours

### 7.2 Export Functionality Verification

**Status:** ❓ Needs Comprehensive Testing
**Impact:** Core feature functionality
**Locations:** Export/save functionality

**Required Changes:**

- [ ] Verify "Save diagram as PNG" works correctly
- [ ] Verify "Save diagram as JPEG" works correctly
- [ ] Verify "Save diagram as SVG" works correctly
- [ ] Verify "Save diagram as HTML" works correctly
- [ ] Verify "Save diagram as locked HTML" works correctly
- [ ] Test export quality and resolution settings
- [ ] Ensure all export formats preserve diagram accuracy
- [ ] Test export functionality across different browsers

**Estimated Effort:** 3-4 hours

### 7.3 Test Suite Analysis & Fixes

**Status:** ❓ Needs Assessment
**Impact:** Code quality and reliability
**Locations:** Test files and application code

**Required Changes:**

- [ ] Run complete test suite and document failures
- [ ] Categorize test failures: test fixes vs. code bugs
- [ ] Fix failing tests that have incorrect expectations
- [ ] Fix code bugs identified by legitimate test failures
- [ ] Update tests to reflect any new functionality
- [ ] Ensure tests work with localStorage implementation
- [ ] Verify tests work with updated state loading precedence

**Estimated Effort:** 4-6 hours

### 7.4 Comprehensive Test Coverage Audit

**Status:** ❓ Major Gap Analysis Needed
**Impact:** Quality assurance and regression prevention
**Locations:** All test files

**Required Test Scenarios:**

**User Actions to Cover:**

- [ ] All diagram interaction patterns (click, hover, drag)
- [ ] Category editing (add, remove, reorder, modify)
- [ ] Settings changes (theme, display options)
- [ ] Export/save operations in all formats
- [ ] Print functionality
- [ ] URL sharing and state loading
- [ ] Browser refresh scenarios
- [ ] Offline usage patterns

**State Data Scenarios:**

- [ ] Empty/default state
- [ ] Partially filled profiles
- [ ] Complete profiles
- [ ] Custom categories
- [ ] Legacy state migration scenarios
- [ ] Invalid/corrupted state handling
- [ ] localStorage persistence scenarios
- [ ] URL state parameter variations
- [ ] Meta tag state loading scenarios

**Cross-Browser & Device Testing:**

- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile browsers and responsive layouts
- [ ] Different screen sizes and resolutions
- [ ] Touch vs. mouse interaction patterns

**Estimated Effort:** 8-12 hours

### 7.5 Feature Parity with Production Site

**Status:** ❓ Needs Comprehensive Comparison
**Impact:** Feature completeness and user expectations
**Reference:** <https://www.myautisticprofile.com>

**Required Analysis:**

- [ ] Document all features available on production site
- [ ] Compare against current implementation
- [ ] Identify missing features or functionality gaps
- [ ] Test identical user workflows on both versions
- [ ] Verify visual/design consistency
- [ ] Ensure behavioral consistency
- [ ] Document any intentional differences
- [ ] Create migration plan for any missing features

**Specific Areas to Verify:**

- [ ] Diagram rendering and interaction
- [ ] Category customization capabilities
- [ ] Export and sharing functionality
- [ ] Settings and preferences
- [ ] Help content and guidance
- [ ] Accessibility features
- [ ] Performance characteristics

**Estimated Effort:** 4-6 hours


## Priority 6: Code Quality & MaintenanceFunctionality)

### 1.1 localStorage Persistence Implementation

**Status:** ❌ Missing (Core Requirement Violation)
**Impact:** Users lose work on page refresh
**Location:** `src/state/AppContext.tsx`

The style guide mandates localStorage persistence as a "core requirement for
usability" but this is not implemented.

**Required Changes:**

- [ ] Add `saveStateToLocalStorage(state: ApplicationState): void` function
- [ ] Add `loadStateFromLocalStorage(): ApplicationState | null` function
- [ ] Initialize state from localStorage on app startup
- [ ] Auto-save state changes to localStorage
- [ ] Add error handling for localStorage failures

**Estimated Effort:** 2-3 hours

### 1.2 State Loading Priority Order

**Status:** ❌ Missing (Section 9.5 Violation)
**Impact:** Incorrect state loading behavior
**Location:** `src/state/AppContext.tsx` or `src/state/MigrateState.ts`

Section 9.5 specifies strict state loading precedence that is not implemented.

**Required Order:**

1. URL Query String ✅ (appears implemented)
2. Meta Tag (offline context) ❓ (needs verification)
3. Local Browser Storage ❌ (missing)
4. Meta Tag (web context) ❓ (needs verification)
5. Default State ✅ (implemented)

**Required Changes:**

- [ ] Implement loadStateFromLocalStorage integration
- [ ] Verify meta tag loading works correctly
- [ ] Ensure precedence order is strictly followed
- [ ] Add logging/debugging for state source tracking

**Estimated Effort:** 3-4 hours

## Priority 2: TypeScript & Component Standards

### 2.1 React.FC Type Annotations

**Status:** ❌ Inconsistent (Section 3.3 Violation)
**Impact:** Type safety and consistency issues
**Locations:** Multiple component files

Section 3.3 requires `React.FC<PropsType>` for all components.

**Non-compliant Files:**

- [ ] `src/components/ActionToolbar.tsx`
- [ ] `src/components/DetailedBreakdownTable.tsx`
- [ ] `src/components/EmojiPicker.tsx`
- [ ] `src/components/Header.tsx`
- [ ] `src/components/RadialDiagram.tsx`
- [ ] `src/components/ViewOptions.tsx`
- [ ] `src/views/EditCategoriesView.tsx`
- [ ] `src/views/HelpView.tsx`
- [ ] `src/views/MainView.tsx`

**Pattern to Apply:**

```typescript
type ComponentNameProps = {
  // Define props if any
};

const ComponentName: React.FC<ComponentNameProps> = (props) => {
  // component logic
};
```

**Estimated Effort:** 2-3 hours

### 2.2 Props Type Definitions

**Status:** ⚠️ Partial (Section 3.3 Violation)
**Impact:** Type safety and API clarity
**Locations:** Components accepting props

**Required Changes:**

- [ ] Define props types for all components that accept them
- [ ] Use destructuring in function signatures
- [ ] Co-locate props types with components
- [ ] Ensure all props are properly typed (no `any`)

**Estimated Effort:** 1-2 hours


## Priority 3: CSS Architecture & Styling

### 3.1 Global CSS Cleanup

**Status:** ❌ Violation (Section 4.4)
**Impact:** Maintainability and separation of concerns
**Location:** `src/styles/global.css`

Component-specific styles are mixed into global CSS file.

**Required Changes:**

- [ ] Move `.blueButton` styles to `ActionToolbar.module.css`
- [ ] Move `.focus\:bg-accent` styles to appropriate component modules
- [ ] Move `.data-\[state\=*\]` styles to component modules
- [ ] Keep only true global styles (resets, variables, base elements)
- [ ] Audit for other component-specific styles

**Estimated Effort:** 2-3 hours

### 3.2 CSS Property Ordering

**Status:** ❌ Inconsistent (Section 4.4)
**Impact:** Code readability and maintainability
**Locations:** All CSS files

Section 4.4 requires logical property ordering:

1. Positioning (`position`, `top`, `z-index`)
2. Box Model (`display`, `flex`, `grid`, `width`, `height`, `margin`,
   `padding`)
3. Typography (`font-family`, `font-size`, `color`, `line-height`)
4. Visual (`background`, `border`, `box-shadow`)
5. Animation (`transition`, `animation`)

**Required Changes:**

- [ ] Reorder properties in `src/styles/global.css`
- [ ] Reorder properties in all `*.module.css` files
- [ ] Consider adding a CSS linter rule for this

**Estimated Effort:** 1-2 hours

### 3.3 Base Font Size Standardization

**Status:** ❌ Incorrect (Section 8.1)
**Impact:** Design system consistency
**Location:** `src/styles/global.css`

Section 8.1 requires 14px base font size using CSS variables.

**Required Changes:**

- [ ] Define `--font-size-base: 14px` CSS variable
- [ ] Update all font sizes to use `rem` units relative to base
- [ ] Ensure consistent typography scale

**Estimated Effort:** 1 hour


## Priority 4: Architecture & Component Structure

### 4.1 ViewOptions Component Extraction

**Status:** ❌ Missing (Section 6.1)
**Impact:** Component decomposition violation
**Location:** `src/views/MainView.tsx`

Section 6.1 requires separate `ViewOptions.tsx` component.

**Current Status:** ViewOptions exists but may not be properly extracted

**Required Changes:**

- [ ] Verify ViewOptions component is properly separated
- [ ] Ensure it handles Numbers/Labels/Icons/Theme controls
- [ ] Confirm it reads from and updates global AppSettings
- [ ] Remove any remaining view options logic from MainView

**Estimated Effort:** 1-2 hours

### 4.2 Component Prop Destructuring

**Status:** ⚠️ Inconsistent (Section 3.3)
**Impact:** Code readability
**Locations:** Multiple component files

**Required Changes:**

- [ ] Use object destructuring in component function signatures
- [ ] Make props dependencies explicit
- [ ] Improve readability and maintainability

**Estimated Effort:** 1 hour

## Priority 5: Accessibility & Design System

### 5.1 Color Contrast Audit

**Status:** ❓ Needs Verification (Section 8.3)
**Impact:** Accessibility compliance
**Locations:** All color definitions

Section 8.3 requires WCAG 2.1 AA contrast ratio (4.5:1 minimum).

**Required Changes:**

- [ ] Audit all color combinations for contrast ratios
- [ ] Use tools like WebAIM Contrast Checker
- [ ] Update colors that don't meet requirements
- [ ] Document color palette decisions

**Estimated Effort:** 2-3 hours

### 5.2 Sensory-Friendly Color Palette Review

**Status:** ❓ Needs Review (Section 8.3)
**Impact:** User experience for autistic users
**Locations:** CSS color definitions

**Required Changes:**

- [ ] Review current colors against sensory-friendly guidelines
- [ ] Ensure muted tones and pastels are used
- [ ] Avoid highly saturated/bright colors
- [ ] Use off-whites instead of pure white backgrounds

**Estimated Effort:** 1-2 hours


## Priority 6: Code Quality & Maintenance

### 6.1 Unused CSS Cleanup

**Status:** ❓ Needs Audit (Section 4.4)
**Impact:** Code bloat and maintenance burden
**Locations:** All CSS files

**Required Changes:**

- [ ] Audit all CSS files for unused selectors
- [ ] Remove unused styles
- [ ] Verify no dead code remains

**Estimated Effort:** 1-2 hours

### 6.2 Import Statement Organization

**Status:** ⚠️ Inconsistent
**Impact:** Code organization
**Locations:** All TypeScript files

**Required Changes:**

- [ ] Standardize import statement ordering
- [ ] Group imports logically (React, third-party, local)
- [ ] Use absolute imports where configured

**Estimated Effort:** 1 hour


## Implementation Recommendations

### Phase 1: Critical Path (Priority 1-2)

Focus on localStorage persistence and React.FC types as these are blocking
issues that affect core functionality and type safety.

### Phase 2: CSS Architecture (Priority 3)

Clean up the styling system to ensure proper separation of concerns and
maintainability.

### Phase 3: Polish & Accessibility (Priority 4-6)

Complete component structure improvements and accessibility audits.

### Testing Strategy

- [ ] Run existing test suite after each priority phase
- [ ] Add new tests for localStorage functionality
- [ ] Verify no regressions are introduced

### Documentation Updates

- [ ] Update README.md if architecture changes
- [ ] Document any new patterns or conventions
- [ ] Update style guide if clarifications are needed

---

**Total Estimated Effort:** 37-59 hours
**Recommended Completion Timeline:** 2-4 weeks

**Note:** This TODO represents a comprehensive audit. Not all items may need
to be completed immediately. Prioritize based on current project needs and
available development time.