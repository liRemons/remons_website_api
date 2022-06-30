const router = require("koa-router")();
const {
  queryTechClassList,
  addTechClass,
  uploadTechClassIcon,
  updateTechClass,
  delTechClass,
  addArticle,
  queryArticleList,
  updateArticle,
  getArticleDetail,
  uploadMarkdownImg,
  delArticle,
  markdownToHTML
} = require("../controller/content");
router.prefix("/content");

// 查询技术分类
router.get("/queryTechClassList", (ctx) => queryTechClassList(ctx));
// 新增技术分类
router.post("/addTechClass", (ctx) => addTechClass(ctx));
// 上传技术icon
router.post("/uploadTechClassIcon", (ctx) => uploadTechClassIcon(ctx));
// 上传markdown中图片
router.post("/uploadMarkdownImg", (ctx) => uploadMarkdownImg(ctx));
// 更新技术分类
router.put("/updateTechClass", (ctx) => updateTechClass(ctx));
// 删除技术分类
router.delete("/delTechClass", (ctx) => delTechClass(ctx));
// 新增文章
router.post("/addArticle", (ctx) => addArticle(ctx));

// 查询文章列表
router.get("/queryArticleList", (ctx) => queryArticleList(ctx));
// 查询文章详情
router.get("/getArticleDetail", (ctx) => getArticleDetail(ctx));
// 更新文章
router.put("/updateArticle", (ctx) => updateArticle(ctx));
// 删除文章
router.delete("/delArticle", (ctx) => delArticle(ctx));
// 获取markdown
router.get("/markdownToHTML", (ctx) => markdownToHTML(ctx));
module.exports = router;
