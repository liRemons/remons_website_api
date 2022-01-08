const router = require('koa-router')();
const {
  queryDocList,
  uploadDoc,
  addDoc,
  deleteDoc,
  updateDoc,
} = require('../controller/doc');
router.prefix('/doc');

// 查询文档列表
router.get('/queryDocList', (ctx) => queryDocList(ctx));
// 上传文件
router.get('/uploadDoc', (ctx) => uploadDoc(ctx));
// 新增文档
router.get('/addDoc', (ctx) => addDoc(ctx));
// 删除文档
router.get('/deleteDoc', (ctx) => deleteDoc(ctx));
// 更新文档
router.get('/updateDoc', (ctx) => updateDoc(ctx));

module.exports = router;
