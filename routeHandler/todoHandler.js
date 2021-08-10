const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const todoSchema = require('../schemas/todoSchema');
const Todo = new mongoose.model('Todo', todoSchema);

// ! get all the todo
router.get('/', async (req, res) => {
  await Todo.find({ status: 'active' }, (err, data) => {
    if (err) {
      res.status(500).json({
        error: 'There was a server side error!',
      });
    } else {
      res.status(200).json({
        result: data,
        message: 'Todo get successfully!',
      });
    }
  });
});

// ! get a todo by id
router.get('/:id', async (req, res) => {});

// ! post todo
router.post('/', async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save((err) => {
    if (err) {
      res.status(500).json({
        error: 'There was a server side error!',
      });
    } else {
      res.status(200).json({
        message: 'Todo was inserted successfully!',
      });
    }
  });
});

// ! post multiple todo
router.post('/all', async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({
        error: 'There was a server side error!',
      });
    } else {
      res.status(200).json({
        message: 'Todos ware inserted successfully!',
      });
    }
  });
});

// ! put todo
router.put('/:id', async (req, res) => {
  const result = await Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        status: 'active',
      },
    },
    { useFindAndModify: false },
    (err) => {
      if (err) {
        res.status(500).json({
          error: 'There was a server side error!',
        });
      } else {
        res.status(200).json({
          message: 'Todo was updated successfully!',
        });
      }
    }
  );
  console.log(result);
});

// ! delete todo
router.delete('/:id', async (req, res) => {});

module.exports = router;
