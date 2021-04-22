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

const createMarkdown = async ({ content, folder }) => {
  fs.writeFile(path.join(__dirname, "../upload/" + folder), content, (err) => {
    if (err) throw err;
    return "/upload/" + folder;
  });
};

const addArticle = async (ctx) => {
  const { content } = REQ_ARG({ ctx, method: "POST" });
  const pathname = await createMarkdown({
    content,
    folder: "content/markdown/test.md",
  });
  ctx.body = "aaa";
};

module.exports = {
  addArticle,
};
