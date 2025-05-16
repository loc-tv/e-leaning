-- mysql -u root -p dsp_learning < database/quizzes_questions.sql --
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

-- Insert sample questions
INSERT INTO quizzes_questions (question, options, correct_answer, explanation) VALUES
(
    'Điều chế ASK là viết tắt của:',
    '["Amplitude Shift Keying", "Analog Signal Keying", "Amplitude Signal Keying", "Analog Shift Keying"]',
    0,
    'ASK (Amplitude Shift Keying) là phương pháp điều chế số sử dụng sự thay đổi biên độ của sóng mang để truyền tín hiệu số.'
),
(
    'Phương pháp điều chế nào sử dụng sự thay đổi pha của sóng mang để truyền tín hiệu?',
    '["ASK", "FSK", "PSK", "QAM"]',
    2,
    'PSK (Phase Shift Keying) sử dụng sự thay đổi pha của sóng mang để truyền tín hiệu số.'
),
(
    'Trong điều chế PSK, khi pha thay đổi 180 độ, điều này được gọi là:',
    '["BPSK", "QPSK", "8-PSK", "DPSK"]',
    0,
    'BPSK (Binary Phase Shift Keying) sử dụng hai pha khác nhau 180 độ để biểu diễn hai trạng thái 0 và 1.'
),
(
    'Điều chế QAM là sự kết hợp của:',
    '["ASK và PSK", "ASK và FSK", "PSK và FSK", "PSK và DPSK"]',
    0,
    'QAM (Quadrature Amplitude Modulation) là sự kết hợp của điều chế biên độ (ASK) và điều chế pha (PSK).'
),
(
    'Phương pháp điều chế nào phổ biến nhất trong mạng không dây Wi-Fi?',
    '["ASK", "QPSK", "QAM", "FSK"]',
    2,
    'QAM được sử dụng phổ biến trong mạng Wi-Fi vì hiệu suất băng thông cao và khả năng truyền nhiều bit trên mỗi ký hiệu.'
),
(
    'Độ rộng băng thông của tín hiệu điều chế PSK chủ yếu phụ thuộc vào:',
    '["Biên độ tín hiệu", "Pha tín hiệu", "Tốc độ truyền dữ liệu", "Tần số sóng mang"]',
    2,
    'Độ rộng băng thông của tín hiệu PSK chủ yếu phụ thuộc vào tốc độ truyền dữ liệu (tốc độ bit).'
),
(
    'Điều chế FSK là viết tắt của:',
    '["Frequency Shift Keying", "Frequency Signal Keying", "Fast Signal Keying", "Frequency Spread Keying"]',
    0,
    'FSK (Frequency Shift Keying) là phương pháp điều chế số sử dụng sự thay đổi tần số của sóng mang.'
),
(
    'QPSK là viết tắt của:',
    '["Quadrature Phase Shift Keying", "Quad Phase Signal Keying", "Quality Phase Signal Keying", "Quantized Phase Signal Keying"]',
    0,
    'QPSK (Quadrature Phase Shift Keying) là phương pháp điều chế pha sử dụng 4 pha khác nhau.'
),
(
    'Điều chế nào có khả năng chống nhiễu tốt nhất?',
    '["ASK", "FSK", "PSK", "QAM"]',
    2,
    'PSK có khả năng chống nhiễu tốt nhất vì nhiễu thường ảnh hưởng đến biên độ, trong khi PSK sử dụng pha để truyền thông tin.'
),
(
    '16-QAM có bao nhiêu điểm tín hiệu trên chòm sao tín hiệu?',
    '["4", "8", "16", "32"]',
    2,
    '16-QAM có 16 điểm tín hiệu trên chòm sao, cho phép truyền 4 bit trên mỗi ký hiệu.'
),
(
    'Điều chế nào thường được sử dụng trong công nghệ truyền hình số?',
    '["ASK", "PSK", "QAM", "FSK"]',
    2,
    'QAM được sử dụng phổ biến trong truyền hình số vì hiệu suất băng thông cao và khả năng truyền nhiều bit trên mỗi ký hiệu.'
),
(
    'Điều chế BPSK sử dụng bao nhiêu pha khác nhau?',
    '["1", "2", "4", "8"]',
    1,
    'BPSK sử dụng 2 pha khác nhau (0° và 180°) để biểu diễn hai trạng thái 0 và 1.'
),
(
    'Trong điều chế FSK, tín hiệu mang thay đổi theo:',
    '["Biên độ", "Pha", "Tần số", "Độ rộng"]',
    2,
    'FSK sử dụng sự thay đổi tần số của sóng mang để truyền tín hiệu số.'
),
(
    'QAM là viết tắt của:',
    '["Quadrature Amplitude Modulation", "Quadrature Analog Modulation", "Quadratic Amplitude Modulation", "Quantized Amplitude Modulation"]',
    0,
    'QAM (Quadrature Amplitude Modulation) là phương pháp điều chế kết hợp giữa điều chế biên độ và điều chế pha.'
),
(
    'Điều chế DPSK là viết tắt của:',
    '["Differential Phase Shift Keying", "Digital Phase Shift Keying", "Dual Phase Signal Keying", "Direct Phase Signal Keying"]',
    0,
    'DPSK (Differential Phase Shift Keying) là phương pháp điều chế pha vi sai, sử dụng sự thay đổi pha tương đối giữa các ký hiệu.'
),
(
    'Điều chế OFDM là một dạng của:',
    '["FSK", "PSK", "Đa sóng mang", "Đơn sóng mang"]',
    2,
    'OFDM (Orthogonal Frequency Division Multiplexing) là phương pháp điều chế đa sóng mang, chia luồng dữ liệu thành nhiều luồng con và truyền trên các sóng mang trực giao.'
),
(
    'Để truyền tín hiệu số trên sóng mang tương tự, ta cần sử dụng:',
    '["Điều chế tương tự", "Điều chế số", "Điều chế biên độ", "Điều chế tần số"]',
    1,
    'Để truyền tín hiệu số trên sóng mang tương tự, ta cần sử dụng các phương pháp điều chế số như ASK, FSK, PSK, QAM.'
),
(
    'PSK sử dụng sự thay đổi của:',
    '["Biên độ", "Tần số", "Pha", "Tốc độ"]',
    2,
    'PSK (Phase Shift Keying) sử dụng sự thay đổi pha của sóng mang để truyền tín hiệu số.'
),
(
    'QPSK sử dụng bao nhiêu pha khác nhau?',
    '["2", "4", "8", "16"]',
    1,
    'QPSK sử dụng 4 pha khác nhau (0°, 90°, 180°, 270°) để biểu diễn 2 bit thông tin.'
),
(
    'Phương pháp điều chế nào được sử dụng phổ biến trong truyền thông vệ tinh?',
    '["ASK", "QPSK", "FSK", "PSK"]',
    1,
    'QPSK được sử dụng phổ biến trong truyền thông vệ tinh vì hiệu suất băng thông tốt và khả năng chống nhiễu cao.'
); 