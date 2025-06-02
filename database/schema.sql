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