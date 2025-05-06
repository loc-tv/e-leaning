CREATE DATABASE IF NOT EXISTS dsp_learning;
USE dsp_learning;

CREATE TABLE IF NOT EXISTS signals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  input_signal TEXT NOT NULL,
  result TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  correct_answer INT NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  score INT NOT NULL,
  total INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO quiz_questions (question, options, correct_answer) VALUES
('What is the purpose of modulation in digital communication?', 
'["To reduce noise", "To convert digital signals to analog", "To compress data", "To encrypt signals"]', 1),
('Which modulation technique changes the phase of the carrier signal?', 
'["AM", "FM", "PSK", "QAM"]', 2);