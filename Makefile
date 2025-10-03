# Makefile for autism-wheel React/TypeScript project.
# Using Vite as the build tool.

NODE_VERSION = $(shell node --version 2>/dev/null || echo "not found")
NPM_VERSION = $(shell npm --version 2>/dev/null || echo "not found")
PACKAGE_MANAGER = npm
BUILD_DIR = build
DIST_DIR = build
SRC_DIR = src
NODE_MODULES = node_modules
TEST_RESULTS_DIR = test-results
DEV_PORT = 3000
DEV_HOST = localhost
TEST_URL = http://$(DEV_HOST):$(DEV_PORT)
TIMESTAMP = $(shell date +'%Y-%m-%d-%H%M%S')
SCREENSHOT_DIR = $(TEST_RESULTS_DIR)/screenshots
SCREENSHOT_FILES = $(addprefix $(SCREENSHOT_DIR)/, $(addsuffix .png, main edit help))

CLOUDSDK_CORE_PROJECT = neech-sandbox
export CLOUDSDK_CORE_PROJECT

.DEFAULT_GOAL := all

.PHONY: all clean install build dev test test-headed test-ui format lint type-check preview deps-check deps-update deps-audit screenshots samples

all: clean install build test

clean:
	rm -rf $(BUILD_DIR) $(DIST_DIR) $(NODE_MODULES) $(TEST_RESULTS_DIR)
	rm -f package-lock.json

install:
	$(PACKAGE_MANAGER) install

build: install
	$(PACKAGE_MANAGER) run build

dev: install
	VITE_PORT=$(DEV_PORT) $(PACKAGE_MANAGER) run dev -- --port $(DEV_PORT) --host $(DEV_HOST)

$(DIST_DIR)/index.html: install
	$(PACKAGE_MANAGER) run build

deploy: clean $(DIST_DIR)/index.html screenshots test
	mkdir -pv backup
	gcloud storage cp gs://www.myautisticprofile.com/index.html backup/index-$(TIMESTAMP).html || \
	gsutil cp gs://www.myautisticprofile.com/index.html backup/index-$(TIMESTAMP).html
	gcloud storage cp $(DIST_DIR)/index.html gs://www.myautisticprofile.com/index.html || \
	gsutil cp $(DIST_DIR)/index.html gs://www.myautisticprofile.com/index.html
	gcloud storage cp *.png *.jpg gs://www.myautisticprofile.com/ || \
	gsutil cp *.png *.jpg gs://www.myautisticprofile.com/

test: install
	npx playwright test --reporter=list

test-headed: install
	npx playwright test --headed

test-ui: install
	npx playwright test --ui

screenshots: $(SCREENSHOT_FILES) samples

samples $(SCREENSHOT_FILES): $(DIST_DIR)/index.html
	mkdir -pv $(SCREENSHOT_DIR)
	node scripts/screenshot.js file://$(abspath $<) $(SCREENSHOT_DIR) $(basename $(notdir $@))
	find $(SCREENSHOT_DIR) -ls

preview: build
	npx vite preview

type-check: install
	npx tsc --noEmit

format: install
	@if command -v npx prettier >/dev/null 2>&1; then \
		npx prettier --write "$(SRC_DIR)/**/*.{ts,tsx,js,jsx,json,css}"; \
	else \
		echo "Prettier not found. Install it with: npm install --save-dev prettier"; \
	fi

lint: install
	@if command -v npx eslint >/dev/null 2>&1; then \
		npx eslint $(SRC_DIR) --ext .ts,.tsx,.js,.jsx; \
	else \
		echo "ESLint not found. Install it with: npm install --save-dev eslint"; \
	fi

deps-check:
	$(PACKAGE_MANAGER) outdated || true

deps-update:
	$(PACKAGE_MANAGER) update

deps-audit:
	$(PACKAGE_MANAGER) audit

watch-test: install
	@if command -v npx playwright >/dev/null 2>&1; then \
		echo "Playwright doesn't support watch mode by default."; \
		echo "Use 'make test-ui' for interactive testing."; \
	else \
		echo "No test watch mode available."; \
	fi

install-browsers:
	npx playwright install
