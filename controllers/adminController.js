const QuizzesQuestionModel = require('../models/quizzesQuestionModel');

const getAllQuestions = async (req, res) => {
  const questions = await QuizzesQuestionModel.getAll();
  res.render('admin/questions', { questions });
};

const addQuestion = async (req, res) => {
  const { question, options, correct_answer, explanation } = req.body;
  await QuizzesQuestionModel.add(question, options, correct_answer, explanation);
  res.redirect('/admin/questions');
};

const updateQuestion = async (req, res) => {
  const { id, question, options, correct_answer, explanation } = req.body;
  await QuizzesQuestionModel.update(id, question, options, correct_answer, explanation);
  res.redirect('/admin/questions');
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  await QuizzesQuestionModel.delete(id);
  res.redirect('/admin/questions');
}; 