const query = require('./mysql');
const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const compressing = require('compressing');
const puppeteer = require('puppeteer');
const {
  upload,
  initPage,
  initResult,
  uuid,
  dateFormat,
  REQ_ARG,
  mdToHTML,
  varifyToken,
} = require('../utils');

const search = async ({ sql }) => {
  const result = initResult({});
  const res = await query(sql);
  result.data = res;
  return result;
};

// 查询技术分类
const queryTechClassList = async (ctx) => {
  let userId = '';
  if (ctx.headers.remons_token) {
    userId = varifyToken(ctx.headers.remons_token).id;
  }
  const { name } = REQ_ARG({ ctx, method: 'GET' });
  let sql = `SELECT id,name,icon,DATE_FORMAT(createTime,'%Y-%m-%d %H:%I:%S') AS createTime,userIds
              FROM tech_class
              WHERE NAME LIKE '%${name || ''}%' `;
  if (userId) {
    sql += `AND userIds is null OR userIds='' OR userIds LIKE '%${
      userId || ''
    }%'`;
  } else {
    sql += `AND userIds is null OR userIds=''`;
  }
  const result = await search({ sql });
  ctx.body = result;
};
// 新增技术分类
const addTechClass = async (ctx) => {
  const { name, icon, userIds } = REQ_ARG({ ctx, method: 'POST' });
  let sql = `INSERT INTO tech_class 
    (id,name,icon,userIds,createTime) VALUES 
    ('${uuid()}','${name}','${icon || ''}','${
    userIds || ''
  }','${dateFormat()}')`;
  const res = await query(sql);
  ctx.body = initResult({});
};
// 上传技术 icon
const uploadTechClassIcon = async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: 'content/icon' });
  ctx.body = {
    path,
  };
};

const uploadMarkdownImg = async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: 'content/markdown/img' });
  ctx.body = {
    path,
  };
};

// 更新技术分类
const updateTechClass = async (ctx) => {
  const { name, id, icon, userIds } = REQ_ARG({ ctx, method: 'PUT' });
  let sql = `update tech_class set 
              name='${name}',
              icon='${icon}',
              createTime='${dateFormat()}'`;
  if (userIds) {
    sql += `,userIds='${userIds}'`;
  }
  sql += ` where id ='${id}'`;
  const res = await query(sql);
  ctx.body = initResult({});
};
// 删除技术分类
const delTechClass = async (ctx) => {
  const { ids } = REQ_ARG({ ctx, method: 'DELETE' });
  let sql = `delete from tech_class where id in ('${ids.join("','")}')`;
  const res = await query(sql);
  const result = initResult({});
  ctx.body = result;
};

// 查询技术文章列表
const queryArticleList = async (ctx) => {
  let userId = '';
  if (ctx.headers.remons_token) {
    userId = varifyToken(ctx.headers.remons_token).id;
  }
  const { title, techClassId } = REQ_ARG({ ctx, method: 'GET' });
  let sql = `SELECT A.id, A.title, A.userIds, A.url, A.techClassId, B.name AS techClassName, DATE_FORMAT(A.createTime,'%Y-%m-%d %H:%I:%S') AS createTime
  FROM tech_article AS A
  LEFT OUTER JOIN tech_class AS B ON A.techClassId = B.id where 1=1 `;
  if (techClassId) {
    sql += `and A.techClassId = '${techClassId}' `;
  }
  if (title) {
    sql += `and A.title = '${title}'`;
  }
  if (userId) {
    sql += `AND (A.userIds is null OR A.userIds='' OR A.userIds LIKE '%${userId || ''
      }%') `;
  } else {
    sql += `AND (A.userIds is null OR A.userIds='') `;
  }
  const result = await search({ sql });
  ctx.body = result;
  return result;
};

const getDetail = async (id) => {
  let sql = `select * from tech_article where id = '${id}'`;
  const res = await query({ sql });
  const result = initResult({});
  if (res.length) {
    const data = JSON.parse(JSON.stringify(res[0]));
    if (res[0].content) {
      data.content = new Buffer(res[0].content, 'base64').toString('utf8');
    }
    result.data = data;
  }
  return result;
}

const getArticleDetail = async (ctx) => {
  const { id } = REQ_ARG({ ctx, method: 'GET' });
  const result = await getDetail(id)
  ctx.body = result;
  return result;
};

// 创建markdown文件
const createMarkdown = async ({ content, folder }) => {
  return new Promise((resolve) => {
    fs.writeFile(
      path.join(__dirname, '../upload/' + folder),
      content,
      (err) => {
        if (err) throw err;
        resolve('/upload/' + folder);
      }
    );
  });
};
// 添加文章
const addArticle = async (ctx) => {
  const { content, techClassId, title, userIds } = REQ_ARG({
    ctx,
    method: 'POST',
  });
  const articleSql = `select title from tech_article where title='${title}'`;
  const articleResult = await search({ sql: articleSql });
  if (articleResult.data.length) {
    ctx.body = {
      code: 200,
      success: false,
      message: '标题重复',
    };
    return;
  }
  // const url = await createMarkdown({
  //   content,
  //   folder: `content/markdown/${title}.md`,
  // });
  let sql = `INSERT INTO tech_article
    (id,title,techClassId,userIds,createTime,content) VALUES 
    ('${uuid()}','${title}','${techClassId || ''}',
    '${userIds || ''}','${dateFormat()}','${new Buffer(content).toString(
    'base64'
  )}')`;
  const res = await query(sql);
  ctx.body = initResult({});
};
// 更新文章
const updateArticle = async (ctx) => {
  const { content, id, title, techClassId, userIds } = REQ_ARG({
    ctx,
    method: 'PUT',
  });
  // const url = await createMarkdown({
  //   content,
  //   folder: `content/markdown/${title}.md`,
  // });
  let sql = `update tech_article set 
              title='${title}',
              techClassId='${techClassId}',
              content='${new Buffer(content).toString('base64')}'`;
  if (userIds) {
    sql += `,userIds='${userIds}'`;
  }
  sql += ` where id ='${id}'`;
  const res = await query(sql);
  ctx.body = initResult({});
};

// 删除文章
const delArticle = async (ctx) => {
  const { ids } = REQ_ARG({ ctx, method: 'DELETE' });
  let sql = `delete from tech_article where id in ('${ids.join("','")}')`;
  const res = await query(sql);
  const result = initResult({});
  ctx.body = result;
};

const markdownToHTML = async (ctx) => {
  const {
    data: { content },
    data,
  } = await getArticleDetail(ctx);
  const result = await mdToHTML(content);
  ctx.body = { data: { ...result, ...data }, ...initResult({}) };
};

const downloadMarkdown = async (ctx) => {
  const { data } = await queryArticleList(ctx) || {};
  await fsExtra.emptyDir('./download');
  await fsExtra.emptyDir('./zip');
  const promiseArr = data.map(async item => {
    const detail = await getDetail(item.id);
    const file = `./download/${item.techClassName}/${item.title}.md`;
    fsExtra.outputFileSync(file, detail.data.content)
    return detail;
  });
  await Promise.all(promiseArr);
  const pathName = `zip/${+new Date()}-markdown.zip`
  await compressing.zip.compressDir('./download', `./${pathName}`)
  const result = initResult({
    path: `/${pathName}`
  });
  ctx.body = result;
}

const createHtml = (ctx) => {
  const { dom, css } = REQ_ARG({ ctx, method: 'POST' });

  const content = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>${css} </style>
  </head>
  
  <body>
    ${dom}
  </body>
  </html>
  `

  const folder = 'index.html'
  fs.writeFile(
    path.join(__dirname, '../html/' + folder),
    content,
    async (err) => {
      if (err) throw err;
      // 启动服务
      const browser = await puppeteer.launch();
      // 打开标签页
      const page = await browser.newPage();
      // 转到该地址
      await page.goto('http://remons.cn:3009/html/index.html');
      // html页面转pdf并保存至path
      await page.pdf({
        pageRanges: '',
        margin: { top: 10, left: 5, right: 5, bottom: 10 },
        path: path.join(__dirname, '../html/' + "index.pdf"),
        format: 'A4',
        printBackground: true,
        omitBackground: true
      })
      // await page.screenshot({
      //   quality: 100,
      //   fullPage: true,
      //   type: 'webp',
      //   path: path.join(__dirname, '../html/' + "test.jpeg"),
      // })
      // 关闭浏览器
      await browser.close();
    }
  );

  ctx.body = {}
}


module.exports = {
  queryTechClassList,
  addTechClass,
  uploadTechClassIcon,
  uploadMarkdownImg,
  updateTechClass,
  delTechClass,
  addArticle,
  queryArticleList,
  getArticleDetail,
  updateArticle,
  delArticle,
  markdownToHTML,
  downloadMarkdown,
  createHtml
};
