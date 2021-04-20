const router = require("koa-router")();

const {
  querySongList,
  addSinger,
  updateSinger,
  querySingerList,
  delSinger,
  uploadSingerPhoto,
  uploadMusicFile,
} = require("../controller/music");

router.prefix("/music");

// 获取歌曲列表
router.get("/querySongList", (ctx) => querySongList(ctx));
// 添加歌手
router.post("/addSinger", (ctx) => addSinger(ctx));
// 修改歌手
router.put("/updateSinger", (ctx) => updateSinger(ctx));
// 获取歌手列表
router.get("/querySingerList", (ctx) => querySingerList(ctx));
// 歌手图片上传
router.post("/uploadSingerPhoto", (ctx) => uploadSingerPhoto(ctx));
// 删除歌手
router.delete("/delSinger", (ctx) => delSinger(ctx));
// 歌曲上传
router.post("/uploadMusicFile", (ctx) => uploadMusicFile(ctx));

module.exports = router;
