-- mysql -u root -p dsp_learning < database/quizzes_questions.sql --

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
    'What is the main purpose of modulation in digital communication?',
    JSON_ARRAY(
        'To convert digital signals to analog signals',
        'To increase the bandwidth of the signal',
        'To make the signal suitable for transmission over a channel',
        'To reduce the power consumption of the system'
    ),
    2,
    'Modulation is used to make the signal suitable for transmission over a channel by shifting its frequency to a range that can be effectively transmitted.'
),
(
    'In Amplitude Modulation (AM), what parameter of the carrier signal is varied?',
    JSON_ARRAY(
        'Frequency',
        'Phase',
        'Amplitude',
        'Wavelength'
    ),
    2,
    'In AM, the amplitude of the carrier signal is varied in proportion to the instantaneous amplitude of the modulating signal.'
),
(
    'What is the main advantage of Frequency Modulation (FM) over Amplitude Modulation (AM)?',
    JSON_ARRAY(
        'Lower bandwidth requirement',
        'Better noise immunity',
        'Simpler implementation',
        'Lower power consumption'
    ),
    1,
    'FM has better noise immunity because noise typically affects the amplitude of the signal, which is not used to carry information in FM.'
),
(
    'In Phase Shift Keying (PSK), how many different phase states are used in BPSK?',
    JSON_ARRAY(
        '2',
        '4',
        '8',
        '16'
    ),
    0,
    'BPSK (Binary Phase Shift Keying) uses two different phase states (0° and 180°) to represent binary data.'
),
(
    'What is the relationship between the carrier frequency and the message frequency in AM?',
    JSON_ARRAY(
        'Carrier frequency must be equal to message frequency',
        'Carrier frequency must be less than message frequency',
        'Carrier frequency must be greater than message frequency',
        'There is no specific relationship required'
    ),
    2,
    'The carrier frequency must be much greater than the message frequency to ensure proper modulation and to avoid aliasing.'
),
(
    'What is the bandwidth of an AM signal?',
    JSON_ARRAY(
        'Equal to the carrier frequency',
        'Equal to the message frequency',
        'Twice the message frequency',
        'Equal to the sum of carrier and message frequencies'
    ),
    2,
    'The bandwidth of an AM signal is twice the message frequency because it contains the carrier and two sidebands.'
),
(
    'In FM, what is the term for the maximum deviation of the carrier frequency?',
    JSON_ARRAY(
        'Modulation index',
        'Frequency deviation',
        'Bandwidth factor',
        'Carrier swing'
    ),
    1,
    'Frequency deviation is the maximum amount by which the carrier frequency is allowed to deviate from its center frequency in FM.'
),
(
    'What is the main disadvantage of PSK compared to ASK?',
    JSON_ARRAY(
        'Higher bandwidth requirement',
        'More complex implementation',
        'Lower data rate',
        'Higher power consumption'
    ),
    1,
    'PSK is more complex to implement because it requires precise phase control and synchronization at the receiver.'
),
(
    'What is the modulation index in FM?',
    JSON_ARRAY(
        'The ratio of carrier frequency to message frequency',
        'The ratio of frequency deviation to message frequency',
        'The ratio of message frequency to carrier frequency',
        'The ratio of bandwidth to carrier frequency'
    ),
    1,
    'The modulation index in FM is defined as the ratio of frequency deviation to the message frequency, indicating the extent of frequency variation.'
),
(
    'Which modulation technique is most suitable for digital data transmission?',
    JSON_ARRAY(
        'AM',
        'FM',
        'PSK',
        'All are equally suitable'
    ),
    2,
    'PSK is most suitable for digital data transmission because it can represent discrete states (0 and 1) using different phase values.'
);
