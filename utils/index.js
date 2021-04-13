const fs = require("fs");
const path = require("path");
const UUID = require("uuid");
const jwt = require("jsonwebtoken");
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
// 生成唯一UUID
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
// 验证token
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
module.exports = {
  upload,
  uuid,
  createToken,
  varifyToken,
};
