CREATE DATABASE IF NOT EXISTS dsp_learning;
USE dsp_learning;

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quizzes_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer INT NOT NULL,
    explanation TEXT NOT NULL
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quizzes_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    taken_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tabs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    content TEXT
);

CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    tab_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tab_id) REFERENCES tabs(id) ON DELETE CASCADE
);

INSERT INTO tabs (name, content) VALUES
('Study Materials', 'Nội dung tài liệu học tập...'),
('Simulations', 'Nội dung mô phỏng...'),
('Quizzes', 'Nội dung bài kiểm tra...');