const fs = require("fs");
const path = require("path");
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
module.exports = {
  upload,
};
