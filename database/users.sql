CREATE DATABASE IF NOT EXISTS dsp_learning;
USE dsp_learning;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, email, role) VALUES
('root', '$2b$10$rfpcDc7p8J1oBngTqdu9V.06F9ejqw15/Hpn7r9F2wRHU.22nwkKS', 'root@example.com', 'admin'),
('admin', '$2b$10$rfpcDc7p8J1oBngTqdu9V.06F9ejqw15/Hpn7r9F2wRHU.22nwkKS', 'admin@example.com', 'admin');

