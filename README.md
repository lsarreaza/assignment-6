# Triviabook

A Node.js and Express API backed by Neon Postgres.

## Database schema

### `topics`

| Column | Type | Description |
| --- | --- | --- |
| `id` | SERIAL | Primary key |
| `name` | VARCHAR(100) | Unique, required topic name |

### `questions`

| Column | Type | Description |
| --- | --- | --- |
| `id` | SERIAL | Primary key |
| `topic_id` | INTEGER | Required foreign key referencing `topics(id)`; cascades on topic deletion |
| `question` | TEXT | Required trivia question |
| `answer` | TEXT | Required correct answer |
| `difficulty` | VARCHAR(10) | Required value: `easy`, `medium`, or `hard` |

The schema and seed data are provided in `database.sql`.

## Setup

### Database setup

1. Create a Neon Postgres project.
2. Open the Neon SQL Editor and run `database.sql`.
3. The script creates the `topics` and `questions` tables and seeds the science and geography questions.
4. Copy the Neon database connection string for use in `.env`.

To verify the seed data, run:

```sql
SELECT * FROM topics;
SELECT * FROM questions;
```

### Local application setup

1. Clone this repository and enter the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   DATABASE_URL=your_neon_database_connection_string
   PORT=3000
   ```

4. Start the server:

   ```bash
   npm start
   ```

The API runs at `http://localhost:3000` by default.

### Live deployment

The deployed API is available at:

https://assignment-6-s6oc.onrender.com/

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/triviabook/topics` | Returns all topics |
| GET | `/triviabook/topic/:topic` | Returns questions for a topic |
| GET | `/triviabook/random` | Returns one random question without the answer |
| POST | `/triviabook/answer` | Checks a question answer |
| POST | `/triviabook/question/add` | Adds a question and creates the topic if needed |

### Get topics

```text
GET /triviabook/topics
```

### Get questions for a topic

```text
GET /triviabook/topic/science
```

The optional `limit` and `difficulty` query parameters may be used together or separately:

```text
GET /triviabook/topic/science?limit=2
GET /triviabook/topic/science?difficulty=easy
GET /triviabook/topic/science?limit=2&difficulty=easy
```

### Get a random question

```text
GET /triviabook/random
```

The response for this route does not include the answer.

### Check an answer

```text
POST /triviabook/answer
```

Request body:

```json
{
  "id": 1,
  "guess": "Mars"
}
```

### Add a question

```text
POST /triviabook/question/add
```

Request body:

```json
{
  "topic": "history",
  "question": "Test Question",
  "answer": "Test Answer",
  "difficulty": "medium"
}
```