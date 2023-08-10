var express = require('express');
var router = express.Router();
const task_helpers = require('../helper/task_helpers');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  res.status(200).send('welcome to task manager api');
});

router.get('/tasks', async (req, res, next) => {
  await task_helpers.getAllTasks().then((response) => {
    res.status(200).json({ tasks: response, message: 'All Tasks fetch successfully' });
  }).catch((err) => {
    res.status(500).send('Error fetching Tasks: ' + err);
  })
});

router.delete('/task/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    await task_helpers.deleteTask(id)
      .then((response) => {
        if (response === true) {
          res.status(200).json({ data: response, message: 'Task deleted successfully' });
        } else {
          res.status(404).json({ data: response, message: 'Task not found' });
        }
      })
      .catch((err) => {
        res.status(500).send('Error deleting task: ' + err);
      });
  } catch (err) {
    res.status(500).send('Server error: ' + err);
  }
});

router.get('/tasks/:priorityId', async (req, res, next) => {
  let priorityId = req.params.priorityId
  await task_helpers.getAllTasksByPriorityId(priorityId).then((response) => {
    res.status(200).json({ tasks: response, message: 'All Tasks Based On Priority fetch successfully' });
  }).catch((err) => {
    res.status(500).send('Error fetching Tasks: ' + err);
  })
});

router.get('/priorities', async (req, res, next) => {
  await task_helpers.getAllPriority().then((response) => {
    res.status(200).json({ priorities: response, message: 'All Priorities fetch successfully' });
  }).catch((err) => {
    res.status(500).send('Error fetching Tasks: ' + err);
  })
});

module.exports = router;
