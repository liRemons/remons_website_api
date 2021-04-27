const query = require("./mysql");
const fs = require("fs");
const path = require("path");
const {
  upload,
  initPage,
  initResult,
  uuid,
  dateFormat,
  REQ_ARG,
} = require("../utils");

const search = async ({ sql }) => {
  const result = initResult({});
  const res = await query(sql);
  result.data = res;
  return result;
};
// 查询文档列表
const queryDocList = async(ctx) => {
  const { name } = REQ_ARG({ ctx, method: "GET" });
  let sql = `select * from doc where name like '%${name||''}%'`
  const result = await search({ sql });
  ctx.body = result;
}


const addDoc = async ctx => {
  const { name } = REQ_ARG({ ctx, method: "GET" });
}


module.exports = {
  queryDocList
}
