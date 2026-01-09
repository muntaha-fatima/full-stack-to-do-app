-- SQL seed data for development and testing

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, completed, due_date, created_at, updated_at)
VALUES
  ('Setup development environment', 'Install all required dependencies and configure the development environment', 'completed', 'high', true, NULL, NOW(), NOW()),
  ('Design database schema', 'Create ERD and define all tables, relationships, and constraints', 'completed', 'high', true, NULL, NOW(), NOW()),
  ('Implement user authentication', 'Add JWT-based authentication with login and registration endpoints', 'in_progress', 'high', false, NOW() + INTERVAL '7 days', NOW(), NOW()),
  ('Create task CRUD endpoints', 'Implement all REST endpoints for task management', 'completed', 'medium', true, NULL, NOW(), NOW()),
  ('Add task filtering and pagination', 'Implement query parameters for filtering and paginating task lists', 'completed', 'medium', true, NULL, NOW(), NOW()),
  ('Write API documentation', 'Document all endpoints with OpenAPI/Swagger', 'in_progress', 'medium', false, NOW() + INTERVAL '3 days', NOW(), NOW()),
  ('Setup CI/CD pipeline', 'Configure GitHub Actions for automated testing and deployment', 'todo', 'high', false, NOW() + INTERVAL '14 days', NOW(), NOW()),
  ('Implement caching layer', 'Add Redis caching for frequently accessed data', 'todo', 'low', false, NOW() + INTERVAL '21 days', NOW(), NOW()),
  ('Add monitoring and logging', 'Integrate Prometheus metrics and structured logging', 'todo', 'medium', false, NOW() + INTERVAL '30 days', NOW(), NOW()),
  ('Write unit tests', 'Achieve 80% code coverage with comprehensive unit tests', 'in_progress', 'high', false, NOW() + INTERVAL '5 days', NOW(), NOW());

-- Log seed completion
SELECT 'Sample tasks inserted successfully' AS status;
