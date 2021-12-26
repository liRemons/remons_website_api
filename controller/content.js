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

// 查询技术分类
const queryTechClassList = async (ctx) => {
  const { name } = REQ_ARG({ ctx, method: "GET" });
  let sql = `SELECT id,name,icon,DATE_FORMAT(createTime,'%Y-%m-%d %H:%I:%S') AS createTime 
              FROM tech_class
              WHERE NAME LIKE '%${name || ""}%'`;
  const result = await search({ sql });
  ctx.body = result;
};
// 新增技术分类
const addTechClass = async (ctx) => {
  const { name, icon } = REQ_ARG({ ctx, method: "POST" });
  let sql = `INSERT INTO tech_class 
    (id,name,icon,createTime) VALUES 
    ('${uuid()}','${name}','${icon || ""}','${dateFormat()}')`;
  const res = await query(sql);
  ctx.body = initResult({});
};
// 上传技术 icon
const uploadTechClassIcon = async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: "content/icon" });
  ctx.body = {
    path,
  };
};
// 更新技术分类
const updateTechClass = async (ctx) => {
  const { name, id, icon } = REQ_ARG({ ctx, method: "PUT" });
  let sql = `update tech_class set 
              name='${name}',
              icon='${icon}',
              createTime='${dateFormat()}' where id ='${id}'`;
  const res = await query(sql);
  ctx.body = initResult({});
};
// 删除技术分类
const delTechClass = async (ctx) => {
  const { ids } = REQ_ARG({ ctx, method: "DELETE" });
  let sql = `delete from tech_class where id in ('${ids.join("','")}')`;
  const res = await query(sql);
  const result = initResult({});
  ctx.body = result;
};

// 查询技术文章列表
const queryArticleList = async (ctx) => {
  const { title, techClassId } = REQ_ARG({ ctx, method: "GET" });
  let sql = `SELECT A.id, A.title, A.url, A.techClassId, B.name AS techClassName, DATE_FORMAT(A.createTime,'%Y-%m-%d %H:%I:%S') AS createTime
  FROM tech_article AS A
  LEFT OUTER JOIN tech_class AS B ON A.techClassId = B.id where 1=1 `;
  if(techClassId){
    sql += `and A.techClassId = '${techClassId}' `
  }
  if(title){
    sql += `and A.title = '${title}'`
  }
  const result = await search({ sql });
  ctx.body = result;
};
// 创建markdown文件
const createMarkdown = async ({ content, folder }) => {
  return new Promise((resolve) => {
    fs.writeFile(
      path.join(__dirname, "../upload/" + folder),
      content,
      (err) => {
        if (err) throw err;
        resolve("/upload/" + folder);
      }
    );
  });
};
// 添加文章
const addArticle = async (ctx) => {
  const { content, techClassId, title } = REQ_ARG({ ctx, method: "POST" });
  const url = await createMarkdown({
    content,
    folder: `content/markdown/${title}.md`,
  });
  let sql = `INSERT INTO tech_article
    (id,title,techClassId,url,createTime) VALUES 
    ('${uuid()}','${title}','${techClassId || ""}',
    '${url || ""}','${dateFormat()}')`;
  const res = await query(sql);
  ctx.body = initResult({});
};
// 更新文章
const updateArticle = async (ctx) => {
  const { content, id, title, techClassId } = REQ_ARG({ ctx, method: "PUT" });
  const url = await createMarkdown({
    content,
    folder: `content/markdown/${title}.md`,
  });
  let sql = `update tech_article set 
              title='${title}',
              techClassId='${techClassId}',
              url='${url}' where id ='${id}'`;
  const res = await query(sql);
  ctx.body = initResult({});
};

// 删除文章
const delArticle = async (ctx) => {
  const { ids } = REQ_ARG({ ctx, method: "DELETE" });
  let sql = `delete from tech_article where id in ('${ids.join("','")}')`;
  const res = await query(sql);
  const result = initResult({});
  ctx.body = result;
};

module.exports = {
  queryTechClassList,
  addTechClass,
  uploadTechClassIcon,
  updateTechClass,
  delTechClass,
  addArticle,
  queryArticleList,
  updateArticle,
  delArticle,
};
