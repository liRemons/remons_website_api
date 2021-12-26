const mysql = require('mysql');
const pool = mysql.createPool({
  host: '8.136.206.131',
  user: 'root',
  password: 'Lrq370353.0353',
  database: 'website_manage',
  port: '3306',
  multipleStatements: true, // 允许多条sql同时执行
});

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
            throw err;
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

module.exports = query;
