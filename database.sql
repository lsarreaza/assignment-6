CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty VARCHAR(10) NOT NULL
    CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

INSERT INTO topics (name)
VALUES ('science'), ('geography')
ON CONFLICT (name) DO NOTHING;

INSERT INTO questions (topic_id, question, answer, difficulty)
SELECT id, 'What planet is known as the Red Planet?', 'Mars', 'easy'
FROM topics
WHERE name = 'science'
  AND NOT EXISTS (
    SELECT 1
    FROM questions
    WHERE question = 'What planet is known as the Red Planet?'
  );

INSERT INTO questions (topic_id, question, answer, difficulty)
SELECT id, 'What is the chemical symbol for gold?', 'Au', 'medium'
FROM topics
WHERE name = 'science'
  AND NOT EXISTS (
    SELECT 1
    FROM questions
    WHERE question = 'What is the chemical symbol for gold?'
  );

INSERT INTO questions (topic_id, question, answer, difficulty)
SELECT id, 'What is the powerhouse of the cell?', 'Mitochondria', 'easy'
FROM topics
WHERE name = 'science'
  AND NOT EXISTS (
    SELECT 1
    FROM questions
    WHERE question = 'What is the powerhouse of the cell?'
  );

INSERT INTO questions (topic_id, question, answer, difficulty)
SELECT id, 'What is the capital of Australia?', 'Canberra', 'medium'
FROM topics
WHERE name = 'geography'
  AND NOT EXISTS (
    SELECT 1
    FROM questions
    WHERE question = 'What is the capital of Australia?'
  );

INSERT INTO questions (topic_id, question, answer, difficulty)
SELECT id, 'Which river flows through Cairo?', 'The Nile', 'easy'
FROM topics
WHERE name = 'geography'
  AND NOT EXISTS (
    SELECT 1
    FROM questions
    WHERE question = 'Which river flows through Cairo?'
  );
