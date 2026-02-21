const express = require('express');
const { body } = require('express-validator');
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(protect); // All task routes require auth

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description too long'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
];

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', taskValidation, validate, createTask);
router.put('/:id', taskValidation, validate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
