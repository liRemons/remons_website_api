const query = require('./mysql');
const fs = require('fs');
const path = require('path');
const { upload, initResult, uuid, dateFormat, REQ_ARG } = require('../utils');

const search = async ({ sql }) => {
  const result = initResult({});
  const res = await query(sql);
  result.data = res;
  return result;
};
// 查询
const queryMyInfo = async (ctx) => {
  const { keyName } = REQ_ARG({ ctx, method: 'GET' });
  let sql = `select * from my_info where 1=1 `;
  if (keyName) {
    sql += `and keyName='${keyName}'`;
  }
  const result = await search({ sql });
  ctx.body = result;
};

const uploadMyInfo = async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: 'info' });
  ctx.body = {
    path,
  };
};

const addMyInfo = async (ctx) => {
  const { keyName, val, url, description } = REQ_ARG({ ctx, method: 'POST' });
  let sql = `INSERT INTO my_info
    (id,keyName,val,url,description) VALUES ('${uuid()}','${keyName || ''}','${
    val || ''
  }','${url || ''}','${description || ''}')`;
  console.log(sql);
  const res = await query(sql);
  ctx.body = initResult({});
};

// 更新
const updateMyInfo = async (ctx) => {
  const { keyName, id, url, val, description } = REQ_ARG({
    ctx,
    method: 'PUT',
  });
  let sql = `update my_info set 
             keyName='${keyName}',
             url='${url}',
             val='${val}',
             description='${description}'
            where id ='${id}'`;
  const res = await query(sql);
  ctx.body = initResult({});
};

// 删除
const deleteMyInfo = async (ctx) => {
  const { ids } = REQ_ARG({ ctx, method: 'DELETE' });
  let sql = `delete from my_info where id in ('${ids.join("','")}')`;
  const res = await query(sql);
  const result = initResult({});
  ctx.body = result;
};

module.exports = {
  uploadMyInfo,
  deleteMyInfo,
  updateMyInfo,
  queryMyInfo,
  addMyInfo,
};
