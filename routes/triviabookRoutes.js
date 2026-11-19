const express = require('express');
const controller = require('../controllers/triviabookController');

const router = express.Router();

router.get('/topics', controller.getTopics);
router.get('/topic/:topic', controller.getTopicQuestions);
router.get('/random', controller.getRandomQuestion);
router.post('/answer', controller.checkAnswer);
router.post('/question/add', controller.addQuestion);

module.exports = router;