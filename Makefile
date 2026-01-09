# Makefile for Todo App

.PHONY: help install dev build test lint format clean docker-up docker-down docker-build

# Default target
help:
	@echo "Available commands:"
	@echo "  make install       - Install all dependencies"
	@echo "  make dev          - Start development servers"
	@echo "  make build        - Build all projects"
	@echo "  make test         - Run all tests"
	@echo "  make lint         - Lint all code"
	@echo "  make format       - Format all code"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make docker-up    - Start Docker containers"
	@echo "  make docker-down  - Stop Docker containers"
	@echo "  make docker-build - Build Docker images"

# Install dependencies
install:
	npm install
	cd frontend && npm install
	cd backend && pip install -r requirements.txt

# Development
dev:
	npm run dev

# Build
build:
	npm run build

# Testing
test:
	npm run test

# Linting
lint:
	npm run lint

# Formatting
format:
	npm run format

# Clean
clean:
	npm run clean

# Docker commands
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-build:
	docker-compose build

docker-logs:
	docker-compose logs -f

docker-restart:
	docker-compose restart
