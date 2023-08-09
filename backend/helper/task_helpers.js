var db = require('../config/connection/connection')

module.exports = {
  // fetching all table data from taskTable
  getTasks: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const results = await db.promise().query('SELECT * FROM taskTable');
        resolve(results[0]); // 0 th data is table row data 
      } catch (err) {
        reject(err);
      }
    })
  }
}