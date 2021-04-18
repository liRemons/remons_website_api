const router = require("koa-router")();
const { upload, initPage, initResult, uuid, dateFormat } = require("../utils");
const controller = require("../controller/song");
const query = require("./mysql");
router.prefix("/song");
// 获取歌曲列表
router.get("/queryList", async (ctx) => {
  const {
    query: { name, page },
  } = ctx.request;
  const { limitStart, limitEnd } = initPage({ page });
  let sql = `SELECT id,name,authorId,collectionId,DATE_FORMAT(createTime,'%Y-%m-%d %H:%I:%S') AS createTime 
              FROM music_list 
              WHERE NAME LIKE '%${name}%' LIMIT ${limitStart},${limitEnd}`;
  const result = initResult({});
  const res = await query(sql);
  result.data = res;
  ctx.body = result;
});
// 添加歌手
router.post("/addSinger", async (ctx) => {
  const {
    body: { name, photo },
  } = ctx.request;
  let sql = `INSERT INTO music_singer 
            (id,name,photo,createTime) VALUES 
            ('${uuid()}','${name}','${photo || ""}','${dateFormat()}')`;
  const res = await query(sql);
  ctx.body = initResult({});
});
// 修改歌手
router.put("/updateSinger", async (ctx) => {
  const {
    body: { name, photo, id },
  } = ctx.request;
  let sql = `update music_singer set 
              name='${name}',
              photo='${photo}',
              createTime='${dateFormat()}' where id ='${id}'`;
  const res = await query(sql);
  ctx.body = initResult({});
});
// 获取歌手列表
router.get("/querySingerList", async (ctx) => {
  const {
    query: { name },
  } = ctx.request;
  let sql = `select * from music_singer where 1=1 `;
  if (name) {
    sql += `and name like '%${name}%'`;
  }
  const res = await query(sql);
  const result = initResult({});
  result.data = res;
  ctx.body = result;
});
// 歌手图片上传
router.post("/uploadSingerPhoto", async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: "music/singer" });
  ctx.body = {
    path,
  };
});
// 删除歌手
router.post("/delSinger", async (ctx) => {
  const {
    body: { ids },
  } = ctx.request;
  let sql = `delete from music_singer where id in ('${ids.join("','")}')`;
  const res = await query(sql);
  const result = initResult({});
  ctx.body = result;
});
// 歌曲上传
router.post("/uploadMusicFile", async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: "music/file" });
  ctx.body = {
    path,
  };
});

module.exports = router;
