const query = require('./mysql');
const fs = require('fs');
const path = require('path');
const {
  upload,
  initResult,
  uuid,
  dateFormat,
  REQ_ARG,
  encrypt,
  decrypt,
  createToken,
  varifyToken,
} = require('../utils');
const { DES_IV, DES_KEY } = require('../utils/config');

const search = async ({ sql }) => {
  const result = initResult({});
  const res = await query(sql);
  result.data = res;
  return result;
};

const queryUserEumn = async (ctx) => {
  let sql = `select name,id,account from user where 1=1 `;
  const result = await search({ sql });
  ctx.body = {
    ...result,
  };
};
// 查询
const queryUser = async (ctx) => {
  let userId = '';
  if (ctx.headers.remons_token) {
    userId = varifyToken(ctx.headers.remons_token).id;
  }
  let sqlUserId = `select * from user where id='${userId}'`;
  const userResult = await search({ sql: sqlUserId });
  let role = '';
  if (userResult.data.length) {
    if ((userResult.data[0].role || '').includes('admin')) {
      role = 'admin';
    }
  }
  if (role !== 'admin') {
    ctx.body = {
      code: 403,
      success: false,
      msg: '无权限',
    };
    return;
  }
  const { name, account } = REQ_ARG({ ctx, method: 'GET' });
  let sql = `select * from user where 1=1 `;
  if (name) {
    sql += `and name like '%${name || ''}%'`;
  }
  if (account) {
    sql += `and account='${account}'`;
  }
  const result = await search({ sql });
  ctx.body = {
    ...result,
    data: (result.data || []).map((item) => ({
      ...item,
      password: decrypt({ DES_IV, DES_KEY, MSG: item.password }),
    })),
  };
};

const uploadUser = async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: 'user' });
  ctx.body = {
    path,
  };
};

const addUser = async (ctx) => {
  const { name, password, account, photo } = REQ_ARG({
    ctx,
    method: 'POST',
  });
  let sql = `INSERT INTO user
    (id,account,password,photo,name) VALUES (
      '${uuid()}',
      '${account || ''}',
      '${(password ? encrypt({ DES_IV, DES_KEY, MSG: password }) : '') || ''}',
      '${photo || ''}',
      '${name || ''}'
      )`;
  const res = await query(sql);
  ctx.body = initResult({});
};

// 更新
const updateUser = async (ctx) => {
  const { name, id, photo, password } = REQ_ARG({
    ctx,
    method: 'PUT',
  });
  let sql = `update user set 
             name='${name}',
             photo='${photo}',
             password='${
               password ? encrypt({ DES_IV, DES_KEY, MSG: password }) : '' || ''
             }' 
            where id ='${id}'`;
  const res = await query(sql);
  ctx.body = initResult({});
};

// 删除
const deleteUser = async (ctx) => {
  const { ids } = REQ_ARG({ ctx, method: 'DELETE' });
  let sql = `delete from user where id in ('${ids.join("','")}')`;
  const res = await query(sql);
  const result = initResult({});
  ctx.body = result;
};

const login = async (ctx) => {
  const { password, account } = REQ_ARG({ ctx, method: 'POST' });
  let sql = `select * from user where 1=1 and account='${account}'`;
  const result = await search({ sql });
  if (!result.data.length) {
    ctx.body = {
      success: false,
      msg: '未找到用户',
      code: 401,
    };
    return;
  }
  if (encrypt({ DES_IV, DES_KEY, MSG: password }) === result.data[0].password) {
    ctx.body = {
      ...result,
      data: {
        token: createToken({ account, password, id: result.data[0].id }),
      },
    };
  } else {
    ctx.body = {
      success: false,
      msg: '密码错误',
      code: 401,
    };
  }
};

module.exports = {
  uploadUser,
  deleteUser,
  updateUser,
  queryUser,
  addUser,
  login,
  search,
  queryUserEumn,
};
