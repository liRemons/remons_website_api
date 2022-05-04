const { varifyToken, encrypt } = require('../utils');
const { DES_IV, DES_KEY } = require('../utils/config');
const { search } = require('../controller/user');
const authToken = async (ctx, next) => {
  if (ctx.url === '/user/login') {
    await next();
    return;
  }
  if (ctx.method.toLowerCase() !== 'get') {
    if (!ctx.header.remons_token) {
      ctx.body = {
        code: 401,
        success: false,
        msg: 'TOKEN 无效',
      };
      return;
    }
    const info = varifyToken(ctx.header.remons_token || '');
    if (info) {
      const { password, account } = info;
      let sql = `select * from user where 1=1 and account=${account}`;
      const result = await search({ sql });
      const resultInfo = result.data[0] || {};
      if (
        encrypt({ DES_IV, DES_KEY, MSG: password }) === resultInfo.password &&
        (resultInfo.role || '').includes('admin')
      ) {
        await next();
      } else {
        ctx.body = {
          code: 403,
          success: false,
          msg: '无权限',
        };
        return;
      }
    } else {
      ctx.body = {
        code: 401,
        success: false,
        msg: 'TOKEN 无效',
      };
      return;
    }
  } else {
    await next();
  }
};

module.exports = authToken;
