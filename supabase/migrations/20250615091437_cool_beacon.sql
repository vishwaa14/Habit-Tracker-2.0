-- Create a default user for existing habits
INSERT INTO users (id, username, email, password, role, created_at, updated_at, is_enabled) 
VALUES (1, 'admin', 'admin@habittracker.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN', NOW(), NOW(), true)
ON CONFLICT (id) DO NOTHING;

-- Reset the sequence to start from 2 for new users
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));