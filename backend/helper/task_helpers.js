var db = require('../config/connection/connection')

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
              p.name as priority
            FROM taskTable AS t
            LEFT JOIN priority AS p ON t.priorityId = p.id;
          `);
        resolve(results[0]); // 0 th data is table row data 
      } catch (err) {
        reject(err);
      }
    })
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
        const results = await db.promise().query('SELECT * FROM taskTable WHERE priorityId = ?', [priorityId]);
        resolve(results[0]); // 0 th data is table row data 
      } catch (err) {
        reject(err);
      }
    })
  }
}