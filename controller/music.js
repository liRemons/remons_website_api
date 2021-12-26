const query = require('./mysql');
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

// 添加歌手
const addSinger = async (ctx) => {
  const { name, photo } = REQ_ARG({ ctx, method: 'POST' });
  let sql = `INSERT INTO music_singer 
  (id,name,photo,createTime) VALUES 
  ('${uuid()}','${name}','${photo || ''}','${dateFormat()}')`;
  const res = await query(sql);
  ctx.body = initResult({});
};
//修改歌手
const updateSinger = async (ctx) => {
  const { name, photo, id } = REQ_ARG({ ctx, method: 'PUT' });
  let sql = `update music_singer set 
              name='${name}',
              photo='${photo}',
              createTime='${dateFormat()}' where id ='${id}'`;
  const res = await query(sql);
  ctx.body = initResult({});
};
// 获取歌手列表
const querySingerList = async (ctx) => {
  const { name } = REQ_ARG({ ctx, method: 'GET' });
  let sql = `select * from music_singer where 1=1 `;
  if (name) {
    sql += `and name like '%${name}%'`;
  }
  const result = await search({ sql });
  ctx.body = result;
};
// 删除歌手
const delSinger = async (ctx) => {
  const { ids } = REQ_ARG({ ctx, method: 'DELETE' });
  let sql = `delete from music_singer where id in ('${ids.join("','")}')`;
  const res = await query(sql);
  const result = initResult({});
  ctx.body = result;
};
// 上传歌手图片
const uploadSingerPhoto = async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: 'music/singer' });
  ctx.body = {
    path,
  };
};

// 获取专辑列表
const queryCollectionList = async (ctx) => {
  const { name } = REQ_ARG({ ctx, method: 'GET' });
  let sql = `SELECT id,name,photo,DATE_FORMAT(createTime,'%Y-%m-%d %H:%I:%S') AS createTime 
              FROM music_collection
              WHERE NAME LIKE '%${name || ''}%'`;
  const result = await search({ sql });
  ctx.body = result;
};
// 新增专辑
const addCollection = async (ctx) => {
  const { name } = REQ_ARG({ ctx, method: 'POST' });
  let sql = `INSERT INTO music_collection 
    (id,name,photo,createTime) VALUES 
    ('${uuid()}','${photo || ''}','${name}','${dateFormat()}')`;
  const res = await query(sql);
  ctx.body = initResult({});
};
// 更新专辑
const updateCollection = async (ctx) => {
  const { name, id, photo } = REQ_ARG({ ctx, method: 'PUT' });
  let sql = `update music_collection set 
              name='${name}',
              photo='${photo}',
              createTime='${dateFormat()}' where id ='${id}'`;
  const res = await query(sql);
  ctx.body = initResult({});
};
// 删除专辑
const delCollection = async (ctx) => {
  const { ids } = REQ_ARG({ ctx, method: 'DELETE' });
  let sql = `delete from music_collection where id in ('${ids.join("','")}')`;
  const res = await query(sql);
  const result = initResult({});
  ctx.body = result;
};
// 上传专辑图片
const uploadCollectionPhoto = async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: 'music/collection' });
  ctx.body = {
    path,
  };
};

// 获取歌曲列表
const querySongList = async (ctx) => {
  const { name, page } = REQ_ARG({ ctx, method: 'GET' });
  const { limitStart, limitEnd } = initPage({ page });
  // let sql = `SELECT id,name,authorId,collectionId,DATE_FORMAT(createTime,'%Y-%m-%d %H:%I:%S') AS createTime
  //             FROM music_list
  //             WHERE NAME LIKE '%${name}%' LIMIT ${limitStart},${limitEnd}`;
  let sql = `select a.id, a.name, a.authorId, a.collectionId, b.name as authorName, c.name as collectionName
  from music_list as a
  left outer join music_singer as b on a.authorId = b.id
  left outer join music_collection as c on a.collectionId = c.id`;
  const result = await search({ sql });
  ctx.body = result;
};
// 上传歌曲文件
const uploadMusicFile = async (ctx) => {
  const file = ctx.request.files.file; // 获取上传文件
  const path = await upload({ file, folder: 'music/song' });
  ctx.body = {
    path,
  };
};
// 新增歌曲
const addSong = async (ctx) => {
  const { name, url, authorId, collectionId } = REQ_ARG({
    ctx,
    method: 'POST',
  });
  let sql = `INSERT INTO music_list 
    (
      id,
      name,
      url,
      authorId,
      collectionId,
      createTime
    ) VALUES 
    (
      '${uuid()}',
      '${name}',
      '${url}',
      '${authorId || ''}',
      '${collectionId || ''}',
      '${dateFormat()}'
    )`;
  const res = await query(sql);
  ctx.body = initResult({});
};
const updateSong = async (ctx) => {
  const { name, id, authorId, collectionId } = REQ_ARG({ ctx, method: 'PUT' });
  let sql = `update music_list set 
  name='${name}',
  createTime='${dateFormat()}',
  authorId='${authorId}',
  collectionId='${collectionId}'
  where id ='${id}'`;
  const res = await query(sql);
  ctx.body = initResult({});
};
// 删除歌曲
const delSong = async (ctx) => {
  const { ids } = REQ_ARG({ ctx, method: 'DELETE' });
  let sql = `delete from music_list where id in ('${ids.join("','")}')`;
  const res = await query(sql);
  const result = initResult({});
  ctx.body = result;
};

module.exports = {
  querySongList,
  addSinger,
  updateSinger,
  querySingerList,
  delSinger,
  uploadSingerPhoto,
  queryCollectionList,
  addCollection,
  updateCollection,
  delCollection,
  uploadCollectionPhoto,
  uploadMusicFile,
  addSong,
  delSong,
  updateSong,
};
