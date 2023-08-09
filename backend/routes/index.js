var express = require('express');
var router = express.Router();
const task_helpers = require('../helper/task_helpers');

/* GET users listing. */
router.get('/', async (req, res, next) => {
    res.status(200).send('welcome to task manager api');
});

router.get('/tasks', async (req, res, next) => {
  await task_helpers.getTasks().then((response) => {
    res.status(200).send(response);
  }).catch((err) => {
    console.log('priority');
    res.status(500).send('Error fetching Tasks: ' + err);
  })
});

module.exports = router;
