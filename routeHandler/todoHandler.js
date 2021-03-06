const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const todoSchema = require("../schemas/todoSchema");
const userSchema = require("../schemas/userSchema");
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema)
const checkLogin = require('../middlewares/checkLogin');

// ! get all the todo
router.get('/', checkLogin, (req, res) => {
  Todo.find({})
    .populate('user', 'name username -_id')
    .select({
      _id: 0,
      __v: 0,
      date: 0,
    })
    .limit(20)
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: 'There was a server side error!',
        });
      } else {
        res.status(200).json({
          result: data,
          message: 'Success',
        });
      }
    });
});

// ! get active todo
router.get('/active', async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  try {
    res.status(200).json({
      result: data,
      message: 'Todo get successfully!',
    });
  } catch (err) {
    res.status(500).json({
      error: 'There was a server side error!',
    });
  }
});

// ! get active todo with callback
router.get('/activeCallback', (req, res) => {
  const todo = new Todo();
  todo.findActiveCallback((err, data) => {
    try {
      res.status(200).json({
        result: data,
        message: 'Todo get successfully!',
      });
    } catch (err) {
      res.status(500).json({
        error: 'There was a server side error!',
      });
    }
  });
});

// ! get active todo with statics methods
router.get('/js', async (req, res) => {
  const data = await Todo.findByJS();
  try {
    res.status(200).json({
      result: data,
      message: 'Todo get successfully!',
    });
  } catch (err) {
    res.status(500).json({
      error: 'There was a server side error!',
    });
  }
});

// ! get todo by language
router.get('/language', async (req, res) => {
  const data = await Todo.find().byLanguage('py');
  try {
    res.status(200).json({
      result: data,
      message: 'Todo get successfully!',
    });
  } catch (err) {
    res.status(500).json({
      error: 'There was a server side error!',
    });
  }
});

// ! get a todo by id
router.get('/:id', async (req, res) => {
  try {
    const data = await Todo.find({ _id: req.params.id });
    res.status(200).json({
      result: data,
      message: 'Todo get successfully!',
    });
  } catch (err) {
    res.status(500).json({
      error: 'There was a server side error!',
    });
  }
});

// ! post todo
router.post('/', checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId,
  });

  try {
    const todo = await newTodo.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: todo._id,
        },
      }
    );

    res.status(200).json({
      message: 'Todo was inserted successfully!',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'There was a server side error!',
    });
  }
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
router.delete('/:id', async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).json({
        error: 'There was a server side error!',
      });
    } else {
      res.status(200).json({
        message: 'Todo was deleted successfully!',
      });
    }
  });
});

module.exports = router;
