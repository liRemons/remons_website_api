const service = require('../service/song')

class Song {
  static async find(ctx){
    ctx.body = await service.find()
  }
}

module.exports = Song