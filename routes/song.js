const router = require("koa-router")();
const {
  upload,
  initPage,
  initResult,
  uuid,
  dateFormat,
  REQ_ARG,
} = require("../utils");
const controller = require("../controller/song");
const query = require("./mysql");
router.prefix("/song");

const search = async ({ sql }) => {
  const result = initResult({});
  const res = await query(sql);
  result.data = res;
  return result;
};
// 获取歌曲列表
const querySongList = async (ctx) => {
  const { name, page } = REQ_ARG({ ctx, method: "GET" });
  const { limitStart, limitEnd } = initPage({ page });
  let sql = `SELECT id,name,authorId,collectionId,DATE_FORMAT(createTime,'%Y-%m-%d %H:%I:%S') AS createTime 
              FROM music_list 
              WHERE NAME LIKE '%${name}%' LIMIT ${limitStart},${limitEnd}`;
  const result = await search({ sql });
  ctx.body = result;
};
// 添加歌手
const addSinger = async (ctx) => {
  const { name, photo } = REQ_ARG({ ctx, method: "POST" });
  let sql = `INSERT INTO music_singer 
  (id,name,photo,createTime) VALUES 
  ('${uuid()}','${name}','${photo || ""}','${dateFormat()}')`;
  const res = await query(sql);
  ctx.body = initResult({});
};
//修改歌手
const updateSinger = async (ctx) => {
  const { name, photo, id } = REQ_ARG({ ctx, method: "PUT" });
  let sql = `update music_singer set 
              name='${name}',
              photo='${photo}',
              createTime='${dateFormat()}' where id ='${id}'`;
  const res = await query(sql);
  ctx.body = initResult({});
};
// 获取歌手列表
const querySingerList = async (ctx) => {
  const { name } = REQ_ARG({ ctx, method: "GET" });
  let sql = `select * from music_singer where 1=1 `;
  if (name) {
    sql += `and name like '%${name}%'`;
  }
  const result = await search({ sql });
  ctx.body = result;
};
// 删除歌手
const delSinger = async (ctx) => {
  const { ids } = REQ_ARG({ ctx, method: "DELETE" });
  let sql = `delete from music_singer where id in ('${ids.join("','")}')`;
  const res = await query(sql);
  const result = initResult({});
  ctx.body = result;
};

// 获取歌曲列表
router.get("/queryList", (ctx) => querySongList(ctx));
// 添加歌手
router.post("/addSinger", (ctx) => addSinger(ctx));
// 修改歌手
router.put("/updateSinger", (ctx) => updateSinger(ctx));
// 获取歌手列表
router.get("/querySingerList", (ctx) => querySingerList(ctx));
// 歌手图片上传
router.post("/uploadSingerPhoto", async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: "music/singer" });
  ctx.body = {
    path,
  };
});
// 删除歌手
router.delete("/delSinger", (ctx) => delSinger(ctx));
// 歌曲上传
router.post("/uploadMusicFile", async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: "music/file" });
  ctx.body = {
    path,
  };
});

module.exports = router;
