const router = require('koa-router')();
const {
  addMyInfo,
  deleteMyInfo,
  updateMyInfo,
  queryMyInfo,
  uploadMyInfo,
} = require('../controller/info');
router.prefix('/info');

// 查询
router.get('/queryMyInfo', (ctx) => queryMyInfo(ctx));
// 上传文件
router.get('/uploadMyInfo', (ctx) => uploadMyInfo(ctx));
// 新增
router.get('/addMyInfo', (ctx) => addMyInfo(ctx));
// 删除
router.get('/deleteMyInfo', (ctx) => deleteMyInfo(ctx));
// 更新
router.get('/updateMyInfo', (ctx) => updateMyInfo(ctx));

module.exports = router;
