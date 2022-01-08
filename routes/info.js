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
router.post('/uploadMyInfo', (ctx) => uploadMyInfo(ctx));
// 新增
router.post('/addMyInfo', (ctx) => addMyInfo(ctx));
// 删除
router.delete('/deleteMyInfo', (ctx) => deleteMyInfo(ctx));
// 更新
router.put('/updateMyInfo', (ctx) => updateMyInfo(ctx));

module.exports = router;
