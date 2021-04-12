const query = require("./mysql");

class SongSql {
  find() {
    let sql = `select * from music_list`;
    return query(sql);
  }
}

module.exports = new SongSql();
