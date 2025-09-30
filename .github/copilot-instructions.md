# GitHub Copilot Instructions for the Autistic Wheel Profile Application

This document provides a comprehensive set of instructions, conventions, and
architectural guidelines for developing and refactoring the Autistic Wheel
Profile application. Adherence to these rules is mandatory to ensure code
quality, maintainability, and consistency. These instructions are designed to be
interpreted by GitHub Copilot and human developers.


## Section 1: Core Principles & High-Level Architecture

This section establishes the foundational philosophy and architectural rules for
the application. It provides the high-level context that must be understood
before working on any specific piece of code.


### 1.1 Application Purpose and Overview

The application is a single-page web application (SPA) designed as a personal
tool to help users create, visualize, and share their unique autistic
profile.[1] It is not a medical or diagnostic tool. The application consists of
three primary views:

1. **Main View:** The primary interface where users interact with the radial
   diagram to input their profile traits, view a detailed breakdown, and access
   core functions like saving and sharing.
2. **Edit Categories View:** A dedicated interface for users to customize the
   categories displayed on the wheel, including their names, descriptions,
   icons, and colors.
3. **Help View:** A static page providing guidance, instructions, an embedded
   tutorial video, and links to external resources.

All code generation and refactoring must be framed within this context. The
primary goal is to provide a helpful, non-clinical tool for self-expression and
communication. All UI/UX decisions should prioritize clarity, accessibility, and
user empowerment.


### 1.2 The Single-Page Application (SPA) Model

The application is architected as a Single-Page Application (SPA). This means it
loads a single HTML document and dynamically rewrites the current page with new
data and views, rather than loading entirely new pages from a server.[2] This
model provides a fluid, responsive, and desktop-like user experience, which is
ideal for a highly interactive tool like this one.4

Navigation between the `Main`, `EditCategories`, and `Help` views must be
managed entirely on the client side through state management. The use of a
URL-based routing library (e.g., React Router) is forbidden. The required
pattern is a simple state variable managed within a global context, for example:
`const [currentView, setCurrentView] = useState<'main' | 'edit' | 'help'>('main');`
This approach keeps the application lightweight, self-contained, and fully
functional offline without reliance on browser history APIs.


### 1.3 The Single-File Build Constraint (Critical Instruction)

A critical requirement of this project is that the final production build must
be a single, self-contained HTML file. This file must contain all necessary
JavaScript, CSS, and inlined image/font assets to allow the application to be
downloaded and used entirely offline.[6]

This is a **build-time requirement**, not a development-time one. The
development environment must prioritize a clean, modular source code structure.
**DO NOT** write all code within a single file or manually inline styles and
scripts. The source code **MUST** be organized into logical directories and
files (e.g., `src/components`, `src/views`, `src/state`, `src/styles`).

The build process, configured in `vite.config.ts`, is solely responsible for
bundling the modular source code into the final single-file artifact. This is
typically achieved using a tool like Vite in conjunction with a plugin such as
`vite-plugin-singlefile`.[6] Your role is to maintain the modularity and clarity
of the source code; the build tool will handle the inlining.


### 1.4 Data Persistence and State Management

The application's single-file, offline-first architecture necessitates that
there is no server backend for data storage. To provide a robust user experience
and prevent data loss between sessions, all user-generated data must be
persisted on the client. If a user spends time creating their profile and
customizing categories, that work should not be lost if they refresh the page
or close and reopen the file.

Therefore, all user profile data, custom category configurations, and
application settings must be saved to the browser's `localStorage`. This is not
an optional feature but a core requirement for usability. Specific utility
functions must be created and used for this purpose:

* `saveStateToLocalStorage(state: ApplicationState): void`
* `loadStateFromLocalStorage(): ApplicationState | null`

The application's global state must be initialized from localStorage on startup.
If no saved state is found, the application should load with a default state.
Any change to the user's profile or custom categories must trigger a save to
`localStorage`.


## Section 2: TypeScript Language and Coding Conventions

This section defines the strict standards for writing TypeScript to ensure the
codebase is type-safe, readable, and maintainable.


### 2.1 Strict Mode and Type Safety

To leverage the full power of TypeScript and prevent common errors, the highest
level of type safety must be enforced.

* **Strict Mode:** The `strict: true` compiler option in the `tsconfig.json`
  file must always be enabled. This activates a wide range of type-checking
  behaviors that lead to more robust code.[8]
* **Avoid `any`:** The use of the `any` type is strictly forbidden. It
  effectively disables type-checking for that value and undermines the benefits
  of TypeScript.[8] If a value's type is genuinely unknown, use the
  `unknown` type and perform the necessary type-checking or type assertion to
  narrow it down before use.


### 2.2 Defining Types: `type` vs. `interface`

A consistent strategy for defining types is essential for readability and
maintainability. The following convention must be used[9]:

* **`interface`:** Use `interface` for defining the shape of data model objects.
  Interfaces are well-suited for describing the structure of core application
  data, such as `ProfileCategory` or `UserProfile`.
* **`type`:** Use the `type` alias for all other type definitions. This includes
  defining component props (e.g., `MyComponentProps`), union types (e.g.,
  `'main' | 'edit'`), and function signatures. This makes `type` the default
  choice for most day-to-day development.


### 2.3 Core Data Model Definitions

The entire application state revolves around a few core data structures. To
ensure consistency across all components and functions, adhere strictly to the
following definitions. These types should be centrally located (e.g., in
`src/types/index.ts`).

| Type/Interface Name | Description                | Key Properties            |
| :------------------ | :------------------------- | :------------------------ |
| `ProfileCategory`   | Defines a single customizable category on the wheel. | `id: string` (UUID), `name: string`, `description: string`, `icon: string` (emoji or SVG data URL), `color: string` (hex code) |
| `UserSelection`     | Represents a user's selected impact values for one category. | `categoryId: string`, `typicalImpact: number` (e.g., 0-5), `stressedImpact: number` (e.g., 0-5) |
| `UserProfile`       | The complete user profile, containing all selections. | `selections: UserSelection` |
| `ApplicationState`  | The global state, including view, profile, and settings. | `currentView: View`, `profile: UserProfile`, `categories: ProfileCategory`, `settings: AppSettings` |
| `AppSettings`       | User-configurable display settings. | `showNumbers: boolean`, `showLabels: boolean`, `showIcons: boolean`, `theme: 'dark' | 'light'` |


### 2.4 Naming and Formatting

Consistent naming and formatting conventions are critical for a readable and
professional codebase.[8]

* **Naming Conventions:**
  * **Components, Interfaces, Types:** `PascalCase` (e.g., `RadialDiagram`,
    `interface IProfileCategory`, `type AppSettings`).
  * **Variables, Functions, Hooks:** `camelCase` (e.g., `currentUserSelection`,
    `calculateImpactScore()`).
  * **Constants:** `UPPER_SNAKE_CASE` (e.g., `DEFAULT_CATEGORIES`).
  * **CSS Module Files:** `[ComponentName].module.css` (e.g.,
    `RadialDiagram.module.css`).
* **Formatting:** All code must be automatically formatted using Prettier. A
  project-level `.prettierrc` configuration file defines the formatting rules.
  Ensure your editor is configured to format on save to maintain consistency.


## Section 3: React Component Design and State Management

This section details how to build React components and manage state effectively,
focusing on modern best practices and patterns that fit the application's
architecture.


### 3.1 Functional Components and Hooks

All new components **must** be functional components. The use of class-based
components is deprecated in this project. State, side effects, and other React
features must be managed exclusively using React Hooks (`useState`, `useEffect`,
`useContext`, `useReducer`, etc.).[8] This approach leads to more concise,
readable, and composable components.


### 3.2 Component Decomposition and Single Responsibility

Components should be small and focused. Adhere to the Single Responsibility
Principle: a component should do one thing and do it well. Large, monolithic
components that manage multiple distinct pieces of the UI are difficult to
maintain, test, and reuse.

For example, the `MainView` component should not contain the rendering logic for
the diagram, the toolbar, and the table. Instead, it should act as a container
that composes smaller, dedicated child components: `<RadialDiagram />`,
`<ActionToolbar />`, and `<DetailedBreakdownTable />`. Each of these child
components will then manage its own internal logic and presentation.


### 3.3 Props and Typing

Component props are the primary API for communication between components. They
must be clearly defined and strictly typed.

* **Props Type Definition:** For every component that accepts props, define a
  `type` alias for its props object (e.g., `type RadialDiagramProps = {... }`).
  The props type should be co-located with the component in the same `.tsx`
  file.
* **`React.FC`:** Use the `React.FC` (Function Component) generic type to type
  the component itself, which provides type-checking for the props and a return
  type of `JSX.Element`.[11]
* **Destructuring:** Use object destructuring in the component's function
  signature to unpack props. This improves readability by making it clear which
  props the component depends on.

```typescript
// Example: Correctly typed component with destructured props
type MyButtonProps \= {
  label: string;
  onClick: () \=\> void;
  variant?: 'primary' | 'secondary';
};

const MyButton: React.FC\<MyButtonProps\> \= ({ label, onClick, variant \= 'primary' }) \=\> {
  //... component logic
};
```


### 3.4 State Management Strategy

The application requires a hybrid state management strategy to balance
simplicity, performance, and maintainability.

* **Global State:** For state that is shared across multiple, non-related
  components (e.g., `ApplicationState`), use React's Context API combined with the
  `useReducer` hook. This pattern avoids "prop drilling" and provides a
  centralized, predictable way to manage application-wide data.[10]
  * Create a single `AppContext` that provides both the `state` object and the
    `dispatch` function to its children.
  * All modifications to the global state must be performed by dispatching
    clearly-typed action objects (e.g.,
    `{ type: 'UPDATE_SELECTION', payload: { categoryId: '...', value: 4 } }`).
    This ensures that state transitions are explicit and traceable.
* **Local State:** For state that is only relevant to a single component and its
  direct children (e.g., the open/closed state of a dropdown menu, form input
  values), use the `useState` hook. Using local state for transient or
  component-specific data prevents unnecessary re-renders of the entire
  application and keeps the global state clean and focused on shared data.


## Section 4: Styling Strategy with CSS Modules

To enforce a clean separation of concerns between presentation (CSS) and logic
(JavaScript/TypeScript), a specific styling methodology is mandated.


### 4.1 Rationale and Mandate for CSS Modules

The official styling methodology for this project is **CSS Modules**. This
choice is based on several key advantages:

* **Local Scope by Default:** CSS Modules automatically generate unique class
  names for each component, eliminating the risk of global namespace collisions
  and style leakage. This is a common and difficult-to-debug problem in
  traditional CSS.[13]
* **Separation of Concerns:** Styles are kept in dedicated `.css` files,
  maintaining a clear boundary between styling and component logic. This makes
  the codebase easier to navigate and allows designers and developers to work on
  their respective areas with less friction.
* **Performance:** Unlike many runtime CSS-in-JS libraries, CSS Modules are
  compiled to static CSS files at build time. This means there is no runtime
  performance overhead from parsing and injecting styles with JavaScript,
  leading to a faster Time to First Paint.[15]

The use of runtime CSS-in-JS libraries (such as styled-components or Emotion) is
strictly forbidden in this project.


### 4.2 Usage and Conventions

For every React component that requires styling, create a corresponding
`[ComponentName].module.css` file in the same directory.

1. Import: Import the styles object from the module file within your component:
   `import styles from './MyComponent.module.css';`
2. Apply: Apply classes to JSX elements using the imported styles object:
   `<div className={styles.container}>...</div>`
3. **Dynamic Classes:** For conditional or dynamic class application, use
  template literals or a lightweight utility library like `clsx`.

```typescript
// Example of applying a conditional class
import styles from './Alert.module.css';
import clsx from 'clsx';

type AlertProps \= { type: 'success' | 'error' };

const Alert: React.FC\<AlertProps\> \= ({ type }) \=\> {
  const alertClasses \= clsx(styles.alert, {
    \[styles.success\]: type \=== 'success',
    \[styles.error\]: type \=== 'error',
  });

  return \<div className={alertClasses}\>...\</div\>;
};
```


### 4.3 Global Styles and Theming

Global styles should be used sparingly and managed in a single, dedicated file:
`src/styles/global.css`. This file should contain:

* **CSS Custom Properties (Variables):** The entire design system (colors,
  fonts, spacing, radii, etc.) must be defined as CSS custom properties under a
  `:root` selector. Theming (e.g., dark and light modes) should be implemented
  by redefining these variables within a class or `data-theme` attribute on the
  `<body>` element.
* **Font Definitions:** Any `@font-face` rules for custom fonts.
* **Minimal Resets:** A simple CSS reset to normalize browser default styles.

This `global.css` file should be imported only once at the top level of the
application, typically in `main.tsx` or `App.tsx`.


### 4.4 CSS Best Practices and Conventions

To ensure our CSS is maintainable, scalable, and bug-free, the following
conventions must be strictly followed.

* **No Inline Styles**: It is crucial that bare `style=""` attributes are
  **never** used in JSX. All styling must be handled through the appropriate
  global (`global.css`) or component-level (`*.module.css`) files. This enforces
  a strict separation of concerns.
* **Restricted Use of `!important`**: The `!important` declaration is forbidden
  except in the most extreme cases, such as overriding a third-party library's
  inline style. AI must:
  1. Explicitly explain the reason for its use and get permission from you.
  2. Add a clear comment in the CSS file explaining precisely why it was
     unavoidable (e.g.,
     `/* !important required to override inline style from LibraryX */`).
* **Global vs. Scoped Styles**: A thoughtful balance must be struck between
  global and module-level styles.
  * **Prefer Global Base Styles**: To maintain a consistent look and feel, apply
    global styles to base HTML tags like `h1`, `h2`, `h3`, `p`, and button in
    `global.css`. Avoid creating highly specific utility classes (e.g.,
    `.h1-with-margin`) that are then applied to almost every instance of a tag.
  * **Scope Component-Specific Styles**: If a style is genuinely unique to one
    component, it belongs in that component's CSS Module file.
* **Consistent Whitespace**: To ensure a predictable visual rhythm, avoid adding
  custom `margin` or `padding` directly to `h1`, `h2`, `h3`, and `p` tags at the
  component level. The default whitespace for these elements should be set
  globally. If a component requires different spacing between elements, apply
  the margin or padding to a parent `<div>` or container. Using Flexbox `gap` or
  Grid `gap` on the container is often the best approach.
* **Code Hygiene**: Unused CSS selectors **must be removed** from all CSS files
  to prevent code bloat and confusion during maintenance.
* **Use Logical Properties**: For properties like `margin`, `padding`, and
  `text-align`, prefer logical properties (e.g., `margin-inline-start`,
  `padding-block-end`, `text-align: start`) over physical ones (e.g.,
  `margin-left`, `padding-bottom`, `text-align: left`). This ensures the layout
  adapts correctly for `right-to-left` languages without extra CSS.
* **Property Order**: For readability, CSS properties within a rule should be
  ordered logically. A good convention is:
  1. Positioning (`position`, `top`, `z-index`)
  2. Box Model (`display`, `flex`, `grid`, `width`, `height`, `margin`,
     `padding`)
  3. Typography (`font-family`, `font-size`, `color`, `line-height`)
  4. Visual (`background`, `border`, `box-shadow`)
  5. Animation (`transition`, `animation`)


## Section 5: Radix UI Primitives: Integration and Best Practices

The application uses Radix UI Primitives for its underlying UI components. It is
crucial to use this library according to its design philosophy to leverage its
full benefits, particularly accessibility.


### 5.1 Core Philosophy: Unstyled, Accessible Building Blocks

Radix Primitives are unstyled, accessible UI components. They provide complex
behaviors (like keyboard navigation, focus management, and WAI-ARIA compliance)
out of the box, but they do not provide any visual styling.17 The responsibility
for styling lies entirely with the developer.

Treat Radix components as behavior and accessibility layers, not as
presentational components. The styling will be applied using the CSS Modules
strategy outlined in Section 4. Do not use the separate `Radix Themes` library,
as it imposes its own styling system which is not compatible with this project's
architecture.]19]


### 5.2 Composition with `asChild`

The asChild prop is a core concept in Radix and is the preferred method for
composition.[20] When you pass `asChild={true}` to a Radix component part (like
Dialog.Trigger), Radix will not render its default DOM element. Instead, it will
merge its props and behaviors onto your immediate child component. This avoids
creating unnecessary wrapper `<div>` or `<span>` elements and results in
cleaner, more semantic HTML.

```typescript
// Correct usage of asChild
import * as Dialog from '@radix-ui/react-dialog';
import styles from './MyDialog.module.css';

//...

<Dialog.Root>
  <Dialog.Trigger asChild>
    <button className={styles.myStyledButton}>Open Dialog</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className={styles.overlay} />
    <Dialog.Content className={styles.content}>
      {/*... dialog content */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```


### 5.3 Styling Radix Components

Radix components expose their internal state via `data-state` attributes on the
rendered DOM elements (e.g., `data-state="open"`, `data-state="checked"`,
`data-state="on"`).[21] This is the correct and intended mechanism for applying
styles based on the component's state.

To style a Radix component in its various states, target these data attributes
in your CSS Module file using an attribute selector.

```css
/* Accordion.module.css */
.trigger {
  /* Base styles for the trigger button */
  background-color: var(--color-surface);
  transition: background-color 0.2s ease;
}

.trigger[data-state='open'] {
  /* Styles applied ONLY when the accordion item is open */
  background-color: var(--color-surface-active);
}

.content {
  /* Base styles for the content panel */
  overflow: hidden;
}

.content[data-state='open'] {
  /* Animation for opening */
  animation: slideDown 0.3s ease-out;
}

.content[data-state='closed'] {
  /* Animation for closing */
  animation: slideUp 0.3s ease-out;
}

@keyframes slideDown {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes slideUp {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}
```


## Section 6: View-Specific Implementation Blueprints

This section provides concrete, component-level instructions for implementing
each of the application's three views, based on the provided ASCII art and
application analysis.


### 6.1 Main Application View (`src/views/MainView.tsx`)

This is the central view of the application where users create and view their
profile.

* **Component Breakdown:**
  * `Header.tsx`: A static component containing the main application title
    ("Autism Wheel") and the introductory text/disclaimer.
  * `RadialDiagram.tsx`: The core interactive component. This will be a complex
    SVG-based component responsible for rendering the wheel, slices, labels, and
    user selections. Its state (the `UserProfile`) will be read from the global
    `AppContext`. User clicks on the diagram's segments must dispatch actions to
    the global state reducer to update the `UserSelection` for the corresponding
    category.
  * `ViewOptions.tsx`: A component group containing the controls for toggling
    "Numbers", "Labels", "Icons", and selecting a "Theme". These controls will
    read their state from the `AppSettings` object in the global context and
    dispatch actions to update it.
  * `ActionToolbar.tsx`: Contains the primary action buttons: "Print",
    "Copy Link", "Save diagram", "Edit Categories", and "Help". The
    "Edit Categories" and "Help" buttons will dispatch an action to update the
    `currentView` in the global state to `'edit'` and `'help'` respectively.
  * `DetailedBreakdownTable.tsx`: Renders a table displaying each category's
    name, description, icon, and the user's selected values for "Typical Impact"
    and "Under Stress Impact". This component is a read-only view of the data
    held in the `profile` and `categories` state from the `AppContext`.


### 6.2 Edit Categories View (`src/views/EditCategoriesView.tsx`)

This view allows users to fully customize the categories used in their profile.

* **Component Breakdown:**
  * `EditCategoriesHeader.tsx`: A static component containing the title and
    introductory text for this view.
  * `EditCategoriesToolbar.tsx`: Contains the action buttons specific to this
    view: "Save Categories", "Revert Changes", and "Default Categories".
  * `CategoryList.tsx`: Manages the rendering of the list of editable
    categories. This component should implement drag-and-drop functionality to
    allow users to reorder the categories.
  * `CategoryEditorRow.tsx`: A reusable component representing a single row in
    the category editor list. It will contain controlled form inputs (using
    Radix Primitives like `TextField` and `TextArea`) for the category's icon,
    name, and description, as well as a color picker, a delete button, and a
    drag handle for reordering.
* **State Management Pattern:** This view must use a "draft state" pattern to
  provide a good user experience. When the user navigates to this view, create a
  temporary copy of the current `categories` from the global state and store it in
  this component's local state using `useState`. All edits made by the user
  (changing text, reordering, deleting) will modify this local draft state.
  * The "Save Categories" button will dispatch an action to update the global
    `AppContext` with the contents of the local draft state.
  * The "Revert Changes" button will discard the local draft state and reset it
    by re-copying the original `categories` from the global context.
  * The "Default Categories" button will replace the local draft state with the
    application's hard-coded default category set.


### 6.3 Application Help View (`src/views/HelpView.tsx`)

This is a simple, informational view providing guidance to the user.

* **Component Breakdown:**
  * `HelpContent.tsx`: A largely static component containing all the help text,
    links to external resources, and the embedded YouTube tutorial video.
  * `ReturnButton.tsx`: A prominent button (likely at the top and bottom of the
    page) that allows the user to return to the main application. It will
    dispatch an action to set the `currentView` in the global state back to
    `'main'`.
* **Implementation Note:** The embedded YouTube video must be implemented
  responsively to ensure it scales correctly on all screen sizes and does not
  break the page layout. A common and effective technique is to use the
  `aspect-ratio` CSS property on a container element to maintain the video's
  16:9 aspect ratio.


## Section 7: General Development and UI/UX Conventions

This section contains general best practices and heuristics that should be
applied throughout the development process.


### 7.1 Layout and Responsiveness

* **Prioritize Flow-Based Layouts:** Only use absolute positioning when strictly
  necessary for UI elements like tooltips or modals that must break out of the
  normal document flow. For all standard page and component layouts, opt for
  responsive and well-structured approaches using modern CSS like Flexbox and
  Grid. This ensures the application adapts gracefully to different screen sizes
  and content changes.


### 7.2 UI/UX Heuristics

* **Avoid Single-Option Dropdowns:** Do not use a dropdown or select component
  if there are two or fewer options available. For two options, prefer a switch,
  toggle, or radio buttons. For a single option, display it as static text. This
  prevents unnecessary clicks and provides a clearer user experience.


## Section 8: Design System and Component Conventions

This section defines the foundational elements of the application's design
system. All new UI components should adhere to these conventions to ensure
visual consistency.


### 8.1 Design Tokens

Design tokens are the primitive values of the design system, stored as CSS
custom properties in `src/styles/global.css`.

* **Base Font Size:** Use a base font size of `14px`. This should be defined as
  a CSS variable, e.g., `--font-size-base: 14px;`. All other font sizes (e.g.,
  for headings) should be defined relative to this base using `rem` units.


### 8.2 Button Component

The Button is a fundamental interactive element. A reusable `<Button>` component
should be created to ensure consistency. Buttons must communicate their purpose
and hierarchy through distinct visual styles.


#### Usage

Buttons should be used for important actions that users need to take, such as
saving data, confirming choices, or navigating between views. They must have
clear, action-oriented labels.


#### Variants

* **Primary Button**
  * **Purpose:** Used for the main, affirmative action in a section or view
    (e.g., "Save Categories").
  * **Visual Style:** Bold, filled with the primary brand color to draw the most
    attention.
  * **Usage:** There should typically be only one primary button visible within
    a given context to guide the user toward the most important action.
* **Secondary Button**
  * **Purpose:** Used for alternative or supporting actions that are less
    important than the primary action (e.g., "Revert Changes").
  * **Visual Style:** Outlined with the primary color and a transparent
    background.
  * **Usage:** Can appear alongside a primary button.
* **Tertiary Button**
  * **Purpose:** Used for the least emphasized actions, often for dismissal or
    minor operations (e.g., a "Cancel" button in a dialog).
  * **Visual Style:** Text-only with no border or background, using a neutral or
    primary text color.
  * **Usage:** For actions that should be available but not prominent.


### 8.3 Color Palette

To create a sensory-friendly and calming experience, the application's color
palette must be chosen with care. The goal is to reduce potential
overstimulation while maintaining clarity and aesthetic appeal.[23]

* **Recommended Colors:** Prioritize muted tones, pastels, and warm neutrals.
  These colors are less likely to be visually overwhelming.[25]
  * **Cool Tones:** Soft blues and sage greens can be very soothing and promote
    focus.[23]
  * **Warm Tones:** Dusty pinks, soft oranges, and lilacs can evoke feelings of
    safety and comfort.[24]
  * **Neutrals:** Use off-whites, creams, and soft grays instead of pure white
    for backgrounds to reduce harshness.[24]
* **Colors to Avoid:** Avoid highly saturated, bright, or fluorescent colors,
  as they can be distracting or cause sensory distress.23 In particular, use
  itense reds and yellows very sparingly, if at all, as they can be perceived
  as overly stimulating or aggressive.[24]
* **Contrast:** The application must balance legibility with sensory comfort.
  All text must meet the WCAG 2.1 Level AA contrast ratio of at least 4.5:1 to
  be accessible.30 However, avoid using the highest possible contrast (e.g.,
  pure black text on a pure white background), as this can be jarring for some
  users.[28] Instead, achieve the required contrast ratio using softer
  combinations, such as dark gray text on an off-white background.


### 8.4 Language and Terminology

The language used in the application must be respectful, affirming, and clear to
be inclusive of the neurodivergent community.

* **Identity-First Language:** The autistic community largely prefers
  identity-first language (e.g., "autistic person") over person-first language
  (e.g., "person with autism").33 This is because autism is considered an
  integral part of a person's identity, not a disease they have. The application
  will default to using identity-first language.
* **Affirming Terminology:** Use positive or neutral language that avoids
  pathologizing neurodivergence.[35]
  * **Use:** "autistic person," "on the autism spectrum".[34]
  * **Avoid:** "suffers from autism," "has autism".[33]
  * **Use:** "characteristics," "traits".[36]
  * **Avoid:** "symptoms," "disorder" (in user-facing text).[34]
  * **Avoid:** Functioning labels like "high-functioning" or "low-functioning,"
    and severity labels like "mild" or "severe".36 These are considered
    inaccurate and harmful as they erase both the struggles of those who appear
    "high-functioning" and the strengths of those who appear "low-functioning."
* **Neurodiversity Terms:** Use terminology correctly.
  * **Neurodiversity:** Refers to the natural variation of human brains and
    minds. It is a characteristic of a group (e.g., "a neurodiverse team").[37]
  * **Neurodivergent:** Refers to an individual whose brain functions in ways
    that diverge from dominant societal standards.36 An individual cannot be
    "neurodiverse."
* **Clarity and Directness:** Use clear, direct language and avoid metaphors,
  idioms, or sarcasm (e.g., "it's raining cats and dogs"). These can be
  confusing for users who interpret language literally.[34]


## Section 9: State Management and Backwards Compatibility

This section outlines the critical strategy for handling user data over time,
ensuring that shared profiles remain accessible even as the application evolves.


### 9.1 The Principle of Perpetual Compatibility

A core feature of this application is the ability for users to share their
profile via a URL link. It is a mandatory requirement that these links remain
functional indefinitely. As the application is updated—which may involve addin
 new features or changing the structure of the state data—we must always
 maintain backward compatibility to load and display profiles created with older
 versions of the code. This is a critical user trust and data integrity issue.


### 9.2 State Versioning

To manage changes to the data structure over time, a versioning system must be
implemented within the application state itself.

* **Encode Version Number:** All ApplicationState objects that are serialized
  for sharing (via URL) or for saving to localStorage **must** include a version
  property (e.g., `version: 2`).
* **Increment on Breaking Change:** This version number must be incremented
  whenever a breaking change is made to the `ApplicationState` data structure. A
  breaking change includes adding, removing, or renaming properties, or changing
  a property's data type.


### 9.3 The State Migration Module

To keep the main application logic clean and focused on the current state
structure, all logic for handling older data versions must be isolated in a
single, discrete location.

* **Dedicated Migration File:** Create a dedicated module, for example
  `src/state/MigrateState.ts`, to house all state decoding and migration logic.
* **Single Entry Point:** This module should expose a primary function, such as
  `loadAndMigrateState(encodedState: string): ApplicationState`, which will be
  the sole entry point for processing any external state data.


### 9.4 Migration Logic and Handling Legacy Data

The migration module will be responsible for transforming any version of the
state data into the current ApplicationState format.

* **Check for Version:** The `loadAndMigrateState` function must first decode
  the incoming data and inspect it for a version property.
* **Handle Legacy (Unversioned) State:** If a loaded state object is missing the
  version property, it must be assumed to be a legacy state from the earliest
  version of the application. The code must then apply the necessary
  transformations to convert this legacy structure into the current
  `ApplicationState` format.
* **Apply Sequential Migrations:** If a version property is present but is lower
  than the application's current state version, the function must apply a series
  of migration functions sequentially to bring the data up to date. For example,
  if the loaded state is `version: 1` and the current version is `3`, the
  function must first run a `migrateV1toV2` function, followed by a
  `migrateV2toV3` function.

By isolating this logic, the rest of the application codebase remains simple and
only ever has to interact with the latest, up-to-date `ApplicationState`
structure, significantly reducing cognitive load and preventing bugs.


### **9.5 State Loading Order of Precedence**

The application must be able to load state from multiple sources. To ensure
predictable behavior, state will be loaded according to a strict order of
descending priority. The application will attempt to load state from the first
source in the list; if that source is not present or is invalid, it will proceed
to the next.

The authoritative order of precedence is:

1. **URL Query String**: State encoded into the URL's query parameters (e.g.,
   `?state=...`). This is the highest priority and is used for sharing specific
   profiles.
2. **Meta Tag (Offline Context)**: If the application is loaded from a `file://`
   URL scheme, the state encoded in the
   `<meta name="autism-wheel-state" content="...">` tag is used. This allows a
   saved HTML file to contain its own state and takes precedence over local
   storage.
3. **Local Browser Storage**: The ApplicationState object saved in the browser's
   localStorage from a previous session.
4. **Meta Tag (Web Context)**: If the application is loaded from any URL scheme
   other than `file://` (e.g., `http://`, `https://`), the state encoded in the
   `<meta name="autism-wheel-state" content="...">` tag is checked.
5. **Default State**: If none of the above sources provide a valid state, the
   application will initialize with its hard-coded default categories and an
   empty user profile.


#### Works cited

1. Autism Wheel, accessed on September 27, 2025, [https://www.myautisticprofile.com/](https://www.myautisticprofile.com/)
2. Single-page application \- Wikipedia, accessed on September 27, 2025, [https://en.wikipedia.org/wiki/Single-page\_application](https://en.wikipedia.org/wiki/Single-page_application)
3. What is Single Page Application? \- GeeksforGeeks, accessed on September 27, 2025, [https://www.geeksforgeeks.org/javascript/what-is-single-page-application/](https://www.geeksforgeeks.org/javascript/what-is-single-page-application/)
4. Single-Page Application Architecture | Ramotion Agency, accessed on September 27, 2025, [https://www.ramotion.com/blog/single-page-application-architecture/](https://www.ramotion.com/blog/single-page-application-architecture/)
5. What is Single Page Application? Understanding SPA \- OutSystems, accessed on September 27, 2025, [https://www.outsystems.com/application-development/spa-single-page-app-defined-with-examples/](https://www.outsystems.com/application-development/spa-single-page-app-defined-with-examples/)
6. richardtallent/vite-plugin-singlefile: Vite plugin for inlining JavaScript and CSS resources \- GitHub, accessed on September 27, 2025, [https://github.com/richardtallent/vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile)
7. \[AskJS\] Entire app must compile to single HTML file, no dynamic local asset files. Need a suggestion on frameworks/build tools. : r/javascript \- Reddit, accessed on September 27, 2025, [https://www.reddit.com/r/javascript/comments/xjk9e4/askjs\_entire\_app\_must\_compile\_to\_single\_html\_file/](https://www.reddit.com/r/javascript/comments/xjk9e4/askjs_entire_app_must_compile_to_single_html_file/)
8. Best Practices of ReactJS with TypeScript \- DEV Community, accessed on September 27, 2025, [https://dev.to/deepeshk1204/best-practices-of-reactjs-with-typescript-24p4](https://dev.to/deepeshk1204/best-practices-of-reactjs-with-typescript-24p4)
9. React with TypeScript: Best Practices \- SitePoint, accessed on September 27, 2025, [https://www.sitepoint.com/react-with-typescript-best-practices/](https://www.sitepoint.com/react-with-typescript-best-practices/)
10. seanpmaxwell/React-Ts-Best-Practices \- GitHub, accessed on September 27, 2025, [https://github.com/seanpmaxwell/React-Ts-Best-Practices](https://github.com/seanpmaxwell/React-Ts-Best-Practices)
11. TypeScript with React: Benefits and Best Practices \- GeeksforGeeks, accessed on September 27, 2025, [https://www.geeksforgeeks.org/typescript/typescript-with-react-benefits-and-best-practices/](https://www.geeksforgeeks.org/typescript/typescript-with-react-benefits-and-best-practices/)
12. Using TypeScript \- React, accessed on September 27, 2025, [https://react.dev/learn/typescript](https://react.dev/learn/typescript)
13. CSS Modules vs CSS-in-JS vs Tailwind CSS: A Comprehensive Comparison | by Frontend Highlights | Medium, accessed on September 27, 2025, [https://medium.com/@ignatovich.dm/css-modules-vs-css-in-js-vs-tailwind-css-a-comprehensive-comparison-24e7cb6f48e9](https://medium.com/@ignatovich.dm/css-modules-vs-css-in-js-vs-tailwind-css-a-comprehensive-comparison-24e7cb6f48e9)
14. CSS solutions Battle: Compile time CSS-in-JS vs CSS-in-JS vs CSS Modules vs SASS \- DEV Community, accessed on September 27, 2025, [https://dev.to/fyapy/sass-vs-css-modules-vs-css-in-js-vs-compile-time-css-in-js-who-wins-4cl](https://dev.to/fyapy/sass-vs-css-modules-vs-css-in-js-vs-compile-time-css-in-js-who-wins-4cl)
15. What are main key points when deciding between vanilla CSS, SCSS, CSS modules, and CSS-in-JS? : r/Frontend \- Reddit, accessed on September 27, 2025, [https://www.reddit.com/r/Frontend/comments/1gk5xf0/what\_are\_main\_key\_points\_when\_deciding\_between/](https://www.reddit.com/r/Frontend/comments/1gk5xf0/what_are_main_key_points_when_deciding_between/)
16. CSS vs. CSS-in-JS: How and why to use each \- LogRocket Blog, accessed on September 27, 2025, [https://blog.logrocket.com/css-vs-css-in-js/](https://blog.logrocket.com/css-vs-css-in-js/)
17. Radix Primitives \- Radix UI, accessed on September 27, 2025, [https://www.radix-ui.com/primitives](https://www.radix-ui.com/primitives)
18. Radix UI: Building Accessible React Components from Scratch \- OpenReplay Blog, accessed on September 27, 2025, [https://blog.openreplay.com/radix-building-accessible-react-components/](https://blog.openreplay.com/radix-building-accessible-react-components/)
19. Styling – Radix Themes, accessed on September 27, 2025, [https://www.radix-ui.com/themes/docs/overview/styling](https://www.radix-ui.com/themes/docs/overview/styling)
20. Composition – Radix Primitives, accessed on September 27, 2025, [https://www.radix-ui.com/primitives/docs/guides/composition](https://www.radix-ui.com/primitives/docs/guides/composition)
21. Styling – Radix Primitives, accessed on September 27, 2025, [https://www.radix-ui.com/primitives/docs/guides/styling](https://www.radix-ui.com/primitives/docs/guides/styling)
22. Styling – Radix Primitives, accessed on September 27, 2025, [https://www.radix-ui.com/primitives/docs/guides/styling](https://www.radix-ui.com/primitives/docs/guides/styling)
23. Autism-Friendly Colours for Wall Art & Calm Spaces \- heyasd.com, accessed on September 27, 2025, [https://www.heyasd.com/blogs/autism/autism-friendly-colors](https://www.heyasd.com/blogs/autism/autism-friendly-colors)
24. Explore color & ASD \- DESIGNA11Y, accessed on September 27, 2025, [https://www.design-a11y.com/colors-autism](https://www.design-a11y.com/colors-autism)
25. Color and Light in Interior Spaces for Children with Autism | IDS Blog, accessed on September 27, 2025, [https://idskids.com/color-and-light-interior-spaces-children-with-autism/](https://idskids.com/color-and-light-interior-spaces-children-with-autism/)
26. Talking autism-friendly colors with University of Minnesota, accessed on September 27, 2025, [https://twin-cities.umn.edu/news-events/talking-autism-friendly-colors-university-minnesota](https://twin-cities.umn.edu/news-events/talking-autism-friendly-colors-university-minnesota)
27. Room colors choices for persons with autism \- PPG Paints, accessed on September 27, 2025, [https://www.ppgpaints.com/paint-colors-for-autism](https://www.ppgpaints.com/paint-colors-for-autism)
28. Designing For Neurodiversity: The Impact of Colour \- DENTON, accessed on September 27, 2025, [https://www.denton.co.uk/insights/designing-for-neurodiversity-the-impact-of-colour/](https://www.denton.co.uk/insights/designing-for-neurodiversity-the-impact-of-colour/)
29. Discover comforting colors to help manage your autism in 4 steps \- Rumie Learn, accessed on September 27, 2025, [https://learn.rumie.org/jR/bytes/discover-comforting-colors-to-help-manage-your-autism-in-4-steps/](https://learn.rumie.org/jR/bytes/discover-comforting-colors-to-help-manage-your-autism-in-4-steps/)
30. Accessibility | Color & Type \- UCLA Brand Guidelines, accessed on September 27, 2025, [https://brand.ucla.edu/fundamentals/accessibility/color-type](https://brand.ucla.edu/fundamentals/accessibility/color-type)
31. Accessible Colors: A Complete Guide for Web Design \- AudioEye, accessed on September 27, 2025, [https://www.audioeye.com/post/accessible-colors/](https://www.audioeye.com/post/accessible-colors/)
32. Designing for users on the autistic spectrum | Digital Communications team blog, accessed on September 27, 2025, [https://digitalcommunications.wp.st-andrews.ac.uk/2019/07/08/designing-for-users-on-the-autistic-spectrum/](https://digitalcommunications.wp.st-andrews.ac.uk/2019/07/08/designing-for-users-on-the-autistic-spectrum/)
33. Identity-First Language \- Autistic Self Advocacy Network, accessed on September 27, 2025, [https://autisticadvocacy.org/about-asan/identity-first-language/](https://autisticadvocacy.org/about-asan/identity-first-language/)
34. Making information and the words we use accessible \- NHS England, accessed on September 27, 2025, [https://www.england.nhs.uk/learning-disabilities/about/get-involved/involving-people/making-information-and-the-words-we-use-accessible/](https://www.england.nhs.uk/learning-disabilities/about/get-involved/involving-people/making-information-and-the-words-we-use-accessible/)
35. Neurodiversity Ireland Language Guide, accessed on September 27, 2025, [https://neurodiversityireland.com/wp-content/uploads/2024/08/Neurodiversity-Ireland-Language-Guide.pdf](https://neurodiversityireland.com/wp-content/uploads/2024/08/Neurodiversity-Ireland-Language-Guide.pdf)
36. Language guide – Neurodiversity \- NHS Dorset, accessed on September 27, 2025, [https://nhsdorset.nhs.uk/neurodiversity/about/language/](https://nhsdorset.nhs.uk/neurodiversity/about/language/)
37. Say It Right: A Neurodiversity Language Guide for Allies \- Psychology Today, accessed on September 27, 2025, [https://www.psychologytoday.com/us/blog/positively-different/202503/say-it-right-a-neurodiversity-language-guide-for-allies](https://www.psychologytoday.com/us/blog/positively-different/202503/say-it-right-a-neurodiversity-language-guide-for-allies)
38. Inclusive Language Guide \- WGU Labs, accessed on September 27, 2025, [https://www.wgulabs.org/inclusive-language-category/ability-disability-neurodiversity](https://www.wgulabs.org/inclusive-language-category/ability-disability-neurodiversity)
