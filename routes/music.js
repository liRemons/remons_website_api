const router = require("koa-router")();
const mysql = require("../db");
const { upload } = require("../utils");
router.prefix("/music");
router.get("/getMusicList", async (ctx) => {
  const sql = "SELECT * from MUSIC_LIST";
  let data = await mysql.query({ sql });
  ctx.body = data;
});

router.post("/uploadMusicFile", async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: "music/file" });
  ctx.body = {
    path
  };
});

module.exports = router;
