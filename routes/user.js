const router = require("koa-router")();

const {
  addUser,
  deleteUser,
  updateUser,
  queryUser,
  uploadUser,
  login,
  queryUserEumn
} = require('../controller/user');
router.prefix('/user');

// 查询
router.get('/queryUser', (ctx) => queryUser(ctx));
router.get('/queryUserEumn', (ctx) => queryUserEumn(ctx));
// 上传文件
router.post('/uploadUser', (ctx) => uploadUser(ctx));
// 新增
router.post('/addUser', (ctx) => addUser(ctx));
// 删除
router.delete('/deleteUser', (ctx) => deleteUser(ctx));
// 更新
router.put('/updateUser', (ctx) => updateUser(ctx));

router.post('/login', (ctx) => login(ctx));


module.exports = router;