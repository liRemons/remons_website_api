const router = require("koa-router")();

const {
  querySongList,
  addSinger,
  updateSinger,
  querySingerList,
  delSinger,
  uploadSingerPhoto,
  queryCollectionList,
  addCollection,
  updateCollection,
  delCollection,
  uploadCollectionPhoto,
  uploadMusicFile,
  addSong,
  delSong,
  updateSong,
} = require("../controller/music");

router.prefix("/music");

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

// 获取专辑列表
router.get("/queryCollectionList", (ctx) => queryCollectionList(ctx));
// 新增专辑
router.post("/addCollection", (ctx) => addCollection(ctx));
// 更新专辑
router.put("/updateCollection", (ctx) => updateCollection(ctx));
// 删除专辑
router.delete("/delCollection", (ctx) => delCollection(ctx));
// 上传专辑图片
router.post("/uploadCollectionPhoto", (ctx) => uploadCollectionPhoto(ctx));

// 获取歌曲列表
router.get("/querySongList", (ctx) => querySongList(ctx));
// 新增歌曲
router.post("/addSong", (ctx) => addSong(ctx));
// 更新歌曲
router.put("/updateSong", (ctx) => updateSong(ctx));
// 删除歌曲
router.delete("/delSong", (ctx) => delSong(ctx));
// 歌曲上传
router.post("/uploadMusicFile", (ctx) => uploadMusicFile(ctx));
module.exports = router;
