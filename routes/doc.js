const router = require("koa-router")();
const { queryDocList } = require("../controller/doc");
router.prefix("/doc");

router.get("/queryDocList", (ctx) => queryDocList(ctx));

module.exports = router
