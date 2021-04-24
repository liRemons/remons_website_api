const router = require("koa-router")();
const {
  queryTechClassList,
  addTechClass,
  uploadTechClassIcon,
  updateTechClass,
  delTechClass,
  addArticle,
} = require("../controller/content");
router.prefix("/content");

// 查询技术分类
router.get("/queryTechClassList", (ctx) => queryTechClassList(ctx));
// 新增技术分类
router.post("/addTechClass", (ctx) => addTechClass(ctx));
// 上传技术icon
router.post("/uploadTechClassIcon", (ctx) => uploadTechClassIcon(ctx));
// 更新技术分类
router.put("/updateTechClass", (ctx) => updateTechClass(ctx));
// 删除技术分类
router.delete("/delTechClass", (ctx) => delTechClass(ctx));
// 新增文章
router.post("/addArticle", (ctx) => addArticle(ctx));

module.exports = router;
