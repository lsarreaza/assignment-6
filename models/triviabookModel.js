const db = require('./db');

async function getTopics() {
  const result = await db.query(
    'SELECT id, name FROM topics ORDER BY name'
  );
  return result.rows;
}

async function getTopicByName(name) {
  const result = await db.query(
    'SELECT id, name FROM topics WHERE LOWER(name) = LOWER($1)',
    [name]
  );
  return result.rows[0] || null;
}

async function getQuestionsByTopic(topicName, { limit, difficulty } = {}) {
  const conditions = ['LOWER(t.name) = LOWER($1)'];
  const values = [topicName];

  if (difficulty) {
    values.push(difficulty);
    conditions.push(`q.difficulty = $${values.length}`);
  }

  let sql = `
    SELECT q.id, q.question, q.answer, q.difficulty
    FROM questions q
    JOIN topics t ON t.id = q.topic_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY q.id
  `;

  if (limit) {
    values.push(limit);
    sql += ` LIMIT $${values.length}`;
  }

  const result = await db.query(sql, values);
  return result.rows;
}

async function getRandomQuestion() {
  const result = await db.query(`
    SELECT q.id, q.question, q.difficulty, t.name AS topic
    FROM questions q
    JOIN topics t ON t.id = q.topic_id
    ORDER BY RANDOM()
    LIMIT 1
  `);
  return result.rows[0] || null;
}

async function getQuestionById(id) {
  const result = await db.query(
    'SELECT id, question, answer, difficulty FROM questions WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function addQuestion(topicName, question, answer, difficulty) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    let topicResult = await client.query(
      'SELECT id, name FROM topics WHERE LOWER(name) = LOWER($1)',
      [topicName]
    );

    let topic = topicResult.rows[0];
    if (!topic) {
      topicResult = await client.query(
        'INSERT INTO topics (name) VALUES ($1) RETURNING id, name',
        [topicName.trim()]
      );
      topic = topicResult.rows[0];
    }

    await client.query(
      `INSERT INTO questions (topic_id, question, answer, difficulty)
       VALUES ($1, $2, $3, $4)`,
      [topic.id, question.trim(), answer.trim(), difficulty]
    );

    await client.query('COMMIT');
    return topic;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getTopics,
  getTopicByName,
  getQuestionsByTopic,
  getRandomQuestion,
  getQuestionById,
  addQuestion
};