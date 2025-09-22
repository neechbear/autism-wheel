# Makefile for autism-wheel React/TypeScript project
# Using Vite as the build tool

# Variables
NODE_VERSION := $(shell node --version 2>/dev/null || echo "not found")
NPM_VERSION := $(shell npm --version 2>/dev/null || echo "not found")
PACKAGE_MANAGER := npm
BUILD_DIR := build
DIST_DIR := build
SRC_DIR := src
NODE_MODULES := node_modules
TEST_RESULTS_DIR := test-results
DEV_PORT := 3000
DEV_HOST := localhost
TEST_URL := http://$(DEV_HOST):$(DEV_PORT)

# Default target
.DEFAULT_GOAL := help

# PHONY targets (targets that don't create files)
.PHONY: help all clean install build dev run test test-headed test-ui test-with-server format lint type-check preview serve deps-check deps-update deps-audit status info autismwheel.html

# Help target - displays available commands
help: ## Show this help message
	@echo "autism-wheel Makefile"
	@echo "====================="
	@echo ""
	@echo "Available targets:"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  %-20s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""
	@echo "Environment info:"
	@echo "  Node.js: $(NODE_VERSION)"
	@echo "  npm:     $(NPM_VERSION)"

# Primary targets
all: clean install build test ## Clean, install, build, and test

clean: ## Remove build artifacts and dependencies
	rm -rf $(BUILD_DIR) $(DIST_DIR) $(NODE_MODULES) $(TEST_RESULTS_DIR)
	rm -f package-lock.json

install: ## Install dependencies
	$(PACKAGE_MANAGER) install

build: install ## Build the application for production
	$(PACKAGE_MANAGER) run build

dev: install ## Start development server
	VITE_PORT=$(DEV_PORT) $(PACKAGE_MANAGER) run dev -- --port $(DEV_PORT) --host $(DEV_HOST)

run: dev ## Alias for dev target

# Testing targets
test: test-with-server ## Run all tests with development server

test-with-server: install ## Run tests with development server
	@echo "Starting development server on $(TEST_URL)..."
	@VITE_PORT=$(DEV_PORT) $(PACKAGE_MANAGER) run dev -- --port $(DEV_PORT) --host $(DEV_HOST) > /dev/null 2>&1 & \
	DEV_PID=$$!; \
	echo "Development server started with PID $$DEV_PID"; \
	sleep 5; \
	echo "Running tests against $(TEST_URL)..."; \
	BASE_URL=$(TEST_URL) npx playwright test; \
	TEST_EXIT_CODE=$$?; \
	echo "Stopping development server..."; \
	kill $$DEV_PID 2>/dev/null || true; \
	exit $$TEST_EXIT_CODE

test-headed: install ## Run tests in headed mode (with browser UI)
	@echo "Starting development server on $(TEST_URL)..."
	@VITE_PORT=$(DEV_PORT) $(PACKAGE_MANAGER) run dev -- --port $(DEV_PORT) --host $(DEV_HOST) > /dev/null 2>&1 & \
	DEV_PID=$$!; \
	echo "Development server started with PID $$DEV_PID"; \
	sleep 5; \
	echo "Running tests in headed mode against $(TEST_URL)..."; \
	BASE_URL=$(TEST_URL) npx playwright test --headed; \
	TEST_EXIT_CODE=$$?; \
	echo "Stopping development server..."; \
	kill $$DEV_PID 2>/dev/null || true; \
	exit $$TEST_EXIT_CODE

test-ui: install ## Run tests with Playwright UI
	@echo "Starting development server on $(TEST_URL)..."
	@VITE_PORT=$(DEV_PORT) $(PACKAGE_MANAGER) run dev -- --port $(DEV_PORT) --host $(DEV_HOST) > /dev/null 2>&1 & \
	DEV_PID=$$!; \
	echo "Development server started with PID $$DEV_PID"; \
	sleep 5; \
	echo "Running tests with UI against $(TEST_URL)..."; \
	BASE_URL=$(TEST_URL) npx playwright test --ui; \
	TEST_EXIT_CODE=$$?; \
	echo "Stopping development server..."; \
	kill $$DEV_PID 2>/dev/null || true; \
	exit $$TEST_EXIT_CODE

# Development and quality targets
preview: build ## Preview the production build locally
	npx vite preview

serve: preview ## Alias for preview target

type-check: install ## Run TypeScript type checking
	npx tsc --noEmit

format: install ## Format code (if prettier is available)
	@if command -v npx prettier >/dev/null 2>&1; then \
		npx prettier --write "$(SRC_DIR)/**/*.{ts,tsx,js,jsx,json,css}"; \
	else \
		echo "Prettier not found. Install it with: npm install --save-dev prettier"; \
	fi

lint: install ## Run linter (if ESLint is available)
	@if command -v npx eslint >/dev/null 2>&1; then \
		npx eslint $(SRC_DIR) --ext .ts,.tsx,.js,.jsx; \
	else \
		echo "ESLint not found. Install it with: npm install --save-dev eslint"; \
	fi

# Dependency management
deps-check: ## Check for outdated dependencies
	$(PACKAGE_MANAGER) outdated || true

deps-update: ## Update dependencies
	$(PACKAGE_MANAGER) update

deps-audit: ## Audit dependencies for security vulnerabilities
	$(PACKAGE_MANAGER) audit

# Utility targets
status: ## Show git status and project info
	@echo "Git status:"
	@git status --short || echo "Not a git repository"
	@echo ""
	@echo "Project info:"
	@echo "  Name: $$(cat package.json | grep '"name"' | head -1 | cut -d'"' -f4)"
	@echo "  Version: $$(cat package.json | grep '"version"' | head -1 | cut -d'"' -f4)"
	@echo "  Node.js: $(NODE_VERSION)"
	@echo "  npm: $(NPM_VERSION)"

info: status ## Alias for status target

# Development workflow shortcuts
autismwheel.html: install ## Build the application as a single HTML file
	$(PACKAGE_MANAGER) run build
	mv $(DIST_DIR)/index.html $(DIST_DIR)/autismwheel.html

quick-build: ## Quick build without cleaning
	$(PACKAGE_MANAGER) run build

dev-clean: ## Clean and start development
	$(MAKE) clean
	$(MAKE) dev

prod-build: ## Full production build with clean
	$(MAKE) clean
	$(MAKE) build

# File watching and validation
watch-test: install ## Run tests in watch mode (if available)
	@if command -v npx playwright >/dev/null 2>&1; then \
		echo "Playwright doesn't support watch mode by default."; \
		echo "Use 'make test-ui' for interactive testing."; \
	else \
		echo "No test watch mode available."; \
	fi

# Deployment helpers
dist-check: build ## Check the distribution build
	@ls -la $(BUILD_DIR)/ || ls -la $(DIST_DIR)/ || echo "No build directory found"

# Install Playwright browsers (for testing)
install-browsers: ## Install Playwright browsers
	npx playwright install

# Security and maintenance
security-check: deps-audit ## Alias for deps-audit

# Environment setup
setup: install install-browsers ## Initial project setup
	@echo "Project setup completed!"
	@echo "Run 'make dev' to start development server"
	@echo "Run 'make test' to run tests"
	@echo "Run 'make build' to build for production"