const router = require("koa-router")();
const { addArticle } = require("../controller/content");
router.prefix("/content");

router.post("/addArticle", (ctx) => addArticle(ctx));

module.exports = router;
