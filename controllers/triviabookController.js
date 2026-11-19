const model = require('../models/triviabookModel');

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

async function getTopics(req, res) {
  try {
    const topics = await model.getTopics();
    res.json(topics.map((topic) => topic.name));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve topics.' });
  }
}

async function getTopicQuestions(req, res) {
  try {
    const { topic } = req.params;
    const topicRecord = await model.getTopicByName(topic);

    if (!topicRecord) {
      return res.status(404).json({ error: `Topic '${topic}' was not found.` });
    }

    let limit;
    if (req.query.limit !== undefined) {
      limit = Number(req.query.limit);
      if (!Number.isInteger(limit) || limit < 1) {
        return res.status(400).json({ error: 'Limit must be a positive integer.' });
      }
    }

    const difficulty = req.query.difficulty;
    if (
      difficulty !== undefined &&
      !VALID_DIFFICULTIES.includes(difficulty.toLowerCase())
    ) {
      return res.status(400).json({
        error: 'Difficulty must be easy, medium, or hard.'
      });
    }

    const questions = await model.getQuestionsByTopic(topicRecord.name, {
      limit,
      difficulty: difficulty ? difficulty.toLowerCase() : undefined
    });

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve questions.' });
  }
}

async function getRandomQuestion(req, res) {
  try {
    const question = await model.getRandomQuestion();
    if (!question) {
      return res.status(404).json({ error: 'No questions are available.' });
    }
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve a random question.' });
  }
}

async function checkAnswer(req, res) {
  try {
    const { id, guess } = req.body;

    if (id === undefined || guess === undefined) {
      return res.status(400).json({
        error: 'Both id and guess are required.'
      });
    }

    const questionId = Number(id);
    if (!Number.isInteger(questionId)) {
      return res.status(400).json({ error: 'id must be an integer.' });
    }

    if (typeof guess !== 'string' || guess.trim() === '') {
      return res.status(400).json({ error: 'guess must be a non-empty string.' });
    }

    const question = await model.getQuestionById(questionId);
    if (!question) {
      return res.status(404).json({
        error: `Question with id ${questionId} was not found.`
      });
    }

    const correct =
      guess.trim().toLowerCase() === question.answer.trim().toLowerCase();

    res.json({
      correct,
      answer: question.answer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check the answer.' });
  }
}

async function addQuestion(req, res) {
  try {
    const { topic, question, answer, difficulty } = req.body;

    if (!topic || !question || !answer || !difficulty) {
      return res.status(400).json({
        error: 'topic, question, answer, and difficulty are required.'
      });
    }

    if (
      typeof topic !== 'string' ||
      typeof question !== 'string' ||
      typeof answer !== 'string'
    ) {
      return res.status(400).json({
        error: 'topic, question, and answer must be strings.'
      });
    }

    if (
      typeof difficulty !== 'string' ||
      !VALID_DIFFICULTIES.includes(difficulty.toLowerCase())
    ) {
      return res.status(400).json({
        error: 'Difficulty must be easy, medium, or hard.'
      });
    }

    const normalizedDifficulty = difficulty.toLowerCase();
    const topicRecord = await model.addQuestion(
      topic,
      question,
      answer,
      normalizedDifficulty
    );
    const questions = await model.getQuestionsByTopic(topicRecord.name);

    res.status(201).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add the question.' });
  }
}

module.exports = {
  getTopics,
  getTopicQuestions,
  getRandomQuestion,
  checkAnswer,
  addQuestion
};