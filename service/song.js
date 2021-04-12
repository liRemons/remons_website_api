const songModel = require('../lib/song')
class SongService{
  static async find(){
    return await songModel.find()
  }
}

module.exports = SongService