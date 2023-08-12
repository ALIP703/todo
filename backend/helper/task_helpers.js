var db = require('../config/connection/connection')
var moment = require('moment')
var path = require('path');
var fs = require('fs');

module.exports = {
  // fetching all table data from taskTable
  getAllTasks: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const results = await db.promise().query(`
            SELECT
              t.id,
              t.heading,
              t.description,
              t.dateTime,
              t.image,
              t.createdAt,
              p.name as priority,
              p.id as priorityId
            FROM taskTable AS t
            LEFT JOIN priority AS p ON t.priorityId = p.id;
          `);
        resolve(results[0]); // 0 th data is table row data 
      } catch (err) {
        reject(err);
      }
    })
  },
  createTask: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        userData.dateTime = moment(userData.dateTime).format();
        const columns = Object.keys(userData).join(', ');
        const values = Object.values(userData);
        const placeholders = values.map(() => '?').join(', ');

        const insertQuery = `INSERT INTO taskTable (${columns}) VALUES (${placeholders})`;

        const result = await db.promise().query(insertQuery, values);
        const insertedId = result[0]?.insertId;

        // const [dataRows] = await db.promise().query('SELECT * FROM taskTable');
        resolve({ insertedId });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateTaskImage: (id, image_url) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updateQuery = `UPDATE taskTable SET image = ? WHERE id = ?`;
        const result = await db.promise().query(updateQuery, [image_url, id]);

        if (result[0]?.affectedRows > 0) {
          resolve(true);
        } else {
          reject(false);
        }
      } catch (err) {
        reject(err);
      }
    });
  },
  updateTask: (id, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (data.dateTime) {
          data.dateTime = moment(data?.dateTime).format();
        }
        const keys = Object.keys(data);
        const values = Object.values(data);

        if (keys.length === 0) {
          reject(new Error('No data provided for update.'));
          return;
        }

        const updateQuery = `UPDATE taskTable SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id = ?`;
        const queryParams = [...values, id];

        const result = await db.promise().query(updateQuery, queryParams);

        if (result[0]?.affectedRows > 0) {
          resolve(true);
        } else {
          reject(false);
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
  getAllPriority: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const results = await db.promise().query('SELECT * FROM priority');
        resolve(results[0]); // 0 th data is table row data 
      } catch (err) {
        reject(err);
      }
    })
  },
  getAllTasksByPriorityId: (priorityId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const results = await db.promise().query(`
        SELECT
          t.id,
          t.heading,
          t.description,
          t.dateTime,
          t.image,
          t.createdAt,
          p.name as priority
        FROM taskTable AS t
        LEFT JOIN priority AS p ON t.priorityId = p.id
        WHERE t.priorityId = ?;`, [priorityId]);
        resolve(results[0]); // 0 th data is table row data 
      } catch (err) {
        reject(err);
      }
    })
  },
  deleteTask: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        // get image url for delete image from directory
        const [rows] = await db.promise().query(`SELECT image FROM taskTable WHERE id = ?;`, [id]);
        const image = rows[0].image;
        if (image != undefined) {
          const filename = path.basename(image);
          const currentDir = __dirname;
          const parentDir = path.dirname(currentDir);
          const imagePath = path.join(parentDir, 'assets', 'images', filename);
  
          // Check if the file exists
          if (fs.existsSync(imagePath)) {
            // Delete the file
            fs.unlink(imagePath, error => {
              if (error) {
                console.log(error);
                throw new HttpException(500, `Failed to delete image ${filename}: ${error}`);
              }
            });
          } else {
                console.log(error);
                throw new HttpException(404, `File not found`);
          }
        }
        const deleteResult = await db.promise().query(`
          DELETE FROM taskTable WHERE id = ?;
        `, [id]);

        // Check if any rows were deleted
        if (deleteResult[0].affectedRows === 0) {
          return resolve(false); // No task was deleted
        }

        resolve(true); // Task deleted successfully
      } catch (err) {
        reject(err);
      }
    })
  }
}