const fs = require("fs");
const path = require("path");
const UUID = require("uuid");
const jwt = require("jsonwebtoken");
const methods = require("methods-r");
const upload = ({ file, folder }) => {
  return new Promise((resolve, reject) => {
    try {
      // 创建可读流
      const reader = fs.createReadStream(file.path);

      let filePath =
        path.join(__dirname, "../upload/" + folder) + `/${file.name}`;

      // 创建可写流
      const upStream = fs.createWriteStream(filePath);
      // 可读流通过管道写入可写流
      reader.pipe(upStream);
      resolve(`/upload/${folder}/${file.name}`);
    } catch (error) {
      throw error;
    }
  });
};
// 生成唯一 UUID
const uuid = () => UUID.v1();
// 生成 token
const createToken = (data = {}, dayCount = 7) => {
  const obj = {};
  const secret = "Remons";
  obj.data = data;
  obj.ctime = new Date().getTime();
  obj.expiresIn = 1000 * 60 * 60 * 24 * dayCount;
  return jwt.sign(obj, secret);
};
// 验证 token
const varifyToken = (token) => {
  let result = null;
  const secret = "Remons";
  let { data, ctime, expiresIn } = jwt.verify(token, secret);
  const nowTime = new Date().getTime();
  if (nowTime - ctime < expiresIn) {
    result = data;
  }
  return result;
};
// 页数格式化
const initPage = ({ page }) => {
  const limitStart = page ? Number(page) * 10 : 0;
  const limitEnd = limitStart + 10;
  return { limitStart, limitEnd };
};
// 格式化结果输出
const initResult = ({ code = 200, success = true, msg = "成功" }) => {
  return {
    code,
    success,
    msg,
  };
};
// 获取请求参数
const REQ_ARG = ({ ctx, method }) => {
  let data;
  switch (method) {
    case "GET":
      const { query } = ctx.request;
      data = query;
      break;
    case "POST":
    case "PUT":
    case "DELETE":
      const { body } = ctx.request;
      data = body;
      break;
    default:
      break;
  }
  return data;
};
module.exports = {
  upload,
  uuid,
  createToken,
  varifyToken,
  initPage,
  initResult,
  REQ_ARG,
  ...methods,
};
