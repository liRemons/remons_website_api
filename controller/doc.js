const query = require('./mysql');
const fs = require('fs');
const path = require('path');
const {
  upload,
  initPage,
  initResult,
  uuid,
  dateFormat,
  REQ_ARG,
} = require('../utils');

const search = async ({ sql }) => {
  const result = initResult({});
  const res = await query(sql);
  result.data = res;
  return result;
};
// 查询文档列表
const queryDocList = async (ctx) => {
  const { title } = REQ_ARG({ ctx, method: 'GET' });
  let sql = `select * from doc where title like '%${title || ''}%'`;
  const result = await search({ sql });
  ctx.body = result;
};

const uploadDoc = async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: 'doc' });
  ctx.body = {
    path,
  };
};

const addDoc = async (ctx) => {
  const { title, url } = REQ_ARG({ ctx, method: 'POST' });
  let sql = `INSERT INTO doc
    (id,title,url,createTime) VALUES 
    ('${uuid()}','${title}','${url || ''}','${dateFormat()}')`;
  const res = await query(sql);
  ctx.body = initResult({});
};

// 更新文档
const updateDoc = async (ctx) => {
  const { title, id, url } = REQ_ARG({ ctx, method: 'PUT' });
  let sql = `update doc set 
             title='${title}',
             url='${url}',
             createTime='${dateFormat()}' where id ='${id}'`;
  const res = await query(sql);
  ctx.body = initResult({});
};

// 删除技术分类
const deleteDoc = async (ctx) => {
  const { ids } = REQ_ARG({ ctx, method: 'DELETE' });
  let sql = `delete from doc where id in ('${ids.join("','")}')`;
  const res = await query(sql);
  const result = initResult({});
  ctx.body = result;
};

module.exports = {
  queryDocList,
  uploadDoc,
  addDoc,
  deleteDoc,
  updateDoc,
};
