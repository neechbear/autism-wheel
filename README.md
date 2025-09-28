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
make setup          # Complete project initialization
make dev            # Start development server on http://localhost:3000/
```


## Available Makefile Targets


### Core Build Commands

| Target    | Description                                               |
|-----------|-----------------------------------------------------------|
| `help`    | Show all available Makefile targets (default target)      |
| `clean`   | Remove build artifacts and temporary files                |
| `install` | Install project dependencies via `npm`                    |
| `build`   | Build the application for production                      |
| `dev`     | Start the development server with hot reload on port 3000 |


### Testing Commands

| Target             | Description                                      |
|--------------------|--------------------------------------------------|
| `test`             | Run all tests using Playwright                   |
| `test-with-server` | Start dev server and run tests, then stop server |
| `test-headed`      | Run tests in headed mode (visible browser)       |
| `test-ui`          | Run tests in interactive UI mode                 |
| `watch-test`       | Information about test watch mode options        |
| `install-browsers` | Install Playwright browsers for testing          |


### Development Server Commands

| Target    | Description                                                    |
|-----------|----------------------------------------------------------------|
| `preview` | Preview the production build locally on http://localhost:4173/ |
| `serve`   | Alias for the preview target on http://localhost:4173/         |


### Code Quality Commands

| Target       | Description                                         |
|--------------|-----------------------------------------------------|
| `type-check` | Run TypeScript type checking without emitting files |
| `format`     | Format code using Prettier (if available)           |
| `lint`       | Run ESLint on source files (if available)           |


### Dependency Management

| Target           | Description                                     |
|------------------|-------------------------------------------------|
| `deps-check`     | Check for outdated npm dependencies             |
| `deps-update`    | Update all dependencies to latest versions      |
| `deps-audit`     | Audit dependencies for security vulnerabilities |
| `security-check` | Alias for deps-audit                            |


### Project Information

| Target   | Description                             |
|----------|-----------------------------------------|
| `status` | Show git status and project information |
| `info`   | Alias for status target                 |


### Build Variations

| Target             | Description                                  |
|--------------------|----------------------------------------------|
| `autismwheel.html` | Build application as single HTML file        |
| `quick-build`      | Fast build without cleaning first            |
| `dev-clean`        | Clean build artifacts then start development |
| `prod-build`       | Full production build with clean             |
| `dist-check`       | Inspect the built distribution files         |


### Workflow Helpers

| Target  | Description                                         |
|---------|-----------------------------------------------------|
| `setup` | Complete initial project setup (install + browsers) |


## Usage Examples

```console
# View all available commands
make help

# Development workflow
make clean install    # Fresh start
make dev              # Start development server on http://localhost:3000/

# Testing workflow
make test-with-server # Full test suite with server
make test-ui          # Interactive testing

# Production workflow
make prod-build       # Clean production build
make preview          # Test production build locally

# Code quality
make type-check       # Verify TypeScript types
make format lint      # Format and lint code

# Maintenance
make deps-audit       # Security check
make deps-update      # Update dependencies

# Build the application
make autismwheel.html # Builds the SPA at build/autismwheel.html
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
