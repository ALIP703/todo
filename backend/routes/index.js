var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var router = express.Router();
const task_helpers = require('../helper/task_helpers');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '../assets/images');
    // create the folder if it does not exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const limits = {
  fileSize: 2 * 1024 * 1024, // 2MB
};
const upload = multer({ storage, fileFilter, limits });


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

router.post('/task', async (req, res, next) => {
  await task_helpers.createTask(req.body).then((response) => {
    res.status(200).json({ insertedId: response.insertedId, message: 'task successfully created' });
  }).catch((err) => {
    res.status(500).send('Error creating Tasks: ' + err);
  })
});

router.put('/task/:id', async (req, res, next) => {
  let id = req.params.id
  await task_helpers.updateTask(id, req.body).then((response) => {
    if (response === true) {
      res.status(200).json({ data: response, message: 'task successfully updated' });
    } else {
      res.status(200).json({ data: response, message: 'task could not update' });
    }
  }).catch((err) => {
    res.status(500).send('Error creating Tasks: ' + err);
  })
});

router.post('/task-image', upload.single('image'), async (req, res, next) => {
  if (!req.file) {
    res.status(400).send({ message: 'File is not fount' });
  }
  const image = req.file.filename;
  console.log(image);
  if (!image) {
    res.status(400).send({ message: 'Filename is required' });
  }
  const host = process.env.SERVER;
  const image_url = `${host}/assets/images/${req.file.filename}`;
  const startIndex = image.indexOf('task_') + 'task_'.length;
  const number = image.substring(startIndex, image.indexOf('.'));
  const id = parseInt(number, 10);

  await task_helpers.updateTaskImage(id, image_url).then((response) => {
    if (response === true) {
      res.status(200).json({ response, message: 'task image updated' });
    } else {
      res.status(200).json({ response, message: 'task image could not update' });

    }
  }).catch((err) => {
    res.status(500).send('Error creating Tasks: ' + err);
  })
});

module.exports = router;
