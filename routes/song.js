const router = require("koa-router")();
const { upload } = require("../utils");
const controller = require('../controller/song')
router.prefix("/song");

router.get('/queryList',controller.find)


router.post("/uploadMusicFile", async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: "music/file" });
  ctx.body = {
    path
  };
});

module.exports = router;
