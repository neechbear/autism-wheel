# Autism Wheel Profile Application

A single-page web application (SPA) designed as a personal tool to help users
create, visualize, and share their unique autistic profile. This application is
not a medical or diagnostic tool, but rather a helpful, non-clinical tool for
self-expression and communication.

The `build/autismwheel.html` build artefact is published to a Google Cloud
Platform storage bucket at `gs://www.myautisticprofile.com/index.html`, which
is made public via CloudFlare at <https://www.myautisticprofile.com>.

The application consists of three primary views:

- **Main View**: Interactive radial diagram for inputting profile traits and
                 detailed breakdown
- **Edit Categories View**: Interface for customizing wheel categories (names,
                            descriptions, icons, colors)
- **Help View**: Static page with guidance, tutorial video, and external
                 resources


## Development Setup

The project uses a comprehensive Makefile-based build system. For detailed
architectural guidance and coding standards, see our style guide in
[.github/copilot-instructions.md](.github/copilot-instructions.md).


### Quick Start

```console
make install-browsers install # Complete project initialization
make dev                      # Start development server on http://localhost:3000/
```


## Available Makefile Targets


### Core Build Commands

| Target    | Description                                               |
|-----------|-----------------------------------------------------------|
| `clean`   | Remove build artifacts and temporary files                |
| `install` | Install project dependencies via `npm`                    |
| `build`   | Build the application for production                      |
| `dev`     | Start the development server with hot reload on port 3000 |
| `preview` | Preview the production build locally                      |


### Testing Commands

| Target             | Description                                      |
|--------------------|--------------------------------------------------|
| `test`             | Run all tests using Playwright                   |
| `test-headed`      | Run tests in headed mode (visible browser)       |
| `test-ui`          | Run tests in interactive UI mode                 |
| `watch-test`       | Information about test watch mode options        |
| `install-browsers` | Install Playwright browsers for testing          |


### Test Organization

The project has 171 comprehensive tests organized across 8 test files:

- **`app-basic.spec.ts`**: Basic application functionality and UI elements
- **`circular-diagram.spec.ts`**: Interactive wheel/diagram functionality
- **`configuration.spec.ts`**: Settings and configuration features
- **`data-table.spec.ts`**: Data table display and functionality
- **`export-share.spec.ts`**: Image export formats (PNG, JPEG, SVG) and sharing
- **`html-export.spec.ts`**: HTML export functionality (regular and locked)
- **`label-editing.spec.ts`**: Category and label editing features
- **`theme-switching.spec.ts`**: Theme and visual appearance options
- **`url-state-sharing.spec.ts`**: URL-based state sharing functionality

All tests include comprehensive content validation, not just UI interaction testing.


### Screenshot Commands

| Target        | Description                               |
|---------------|-------------------------------------------|
| `screenshots` | Take screenshots of all application views |

Screenshots are saved to `test-results/screenshots/` with descriptive filenames.


### Code Quality Commands

| Target       | Description                                         |
|--------------|-----------------------------------------------------|
| `type-check` | Run TypeScript type checking without emitting files |
| `format`     | Format code using Prettier (if available)           |
| `lint`       | Run ESLint on source files (if available)           |


### Dependency Management

| Target        | Description                                     |
|---------------|-------------------------------------------------|
| `deps-check`  | Check for outdated npm dependencies             |
| `deps-update` | Update all dependencies to latest versions      |
| `deps-audit`  | Audit dependencies for security vulnerabilities |


## Usage Examples

```console
# Setup
make clean install-browsers

# Development workflow
make clean install    # Fresh start
make dev              # Start development server on http://localhost:3000/

# Testing workflow
make test             # Full test suite with server
make test-ui          # Interactive testing
make test-headed      # Watch full tests as they happen

# Production workflow
make build            # Production build
make preview          # Preview production build locally

# Code quality
make type-check       # Verify TypeScript types
make format lint      # Format and lint code

# Screenshots
make screenshots      # Take screenshots of all views, write to test-results/screenshots/*.png

# Maintenance
make deps-audit       # Security check
make deps-update      # Update dependencies

# Deploy a clean tested SPA index.html to Google Cloud Platform
make clean build test deploy
```


## Architecture

This application is built as a Single-Page Application (SPA) using React and
TypeScript. The production build outputs a single, self-contained HTML file that
works entirely offline. All user data is persisted in the browser's
`localStorage`.

For detailed architectural guidelines, component design patterns, state
management strategies, styling conventions, and development best practices,
please refer to the comprehensive
[GitHub Copilot Instructions](.github/copilot-instructions.md) which serves as
the project style guide.
