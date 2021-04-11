const mysql = require("mysql");
const pool = mysql.createPool({
  host: "8.136.206.131",
  user: "root",
  password: "Lrq370353.0353",
  database: "website_manage",
  // port:'3306'
});

class Mysql {
  constructor() {}
  query({ sql }) {
    return new Promise((resolve, reject) => {
      pool.query(sql, (error, results, fields) => {
        if (error) {
          reject(error);
          throw error;
        }
        resolve(results);
      });
    });
  }
}
module.exports = new Mysql();
