const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const logger = require("koa-logger");
const koaBody = require("koa-body");
const statics = require('koa-static')
const path = require('path')
const InitManger = require('./core/init')

const {createToken,varifyToken} = require('./utils')
// error handler
onerror(app);
const staticPath = './'
app.use(statics(
  path.join(__dirname, staticPath)
))

app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    },
  })
);

app
  .use(json())
  .use(logger())
  .use(require("koa-static")(__dirname + "/public"))
  .use(
    views(__dirname + "/views", {
      extension: "pug",
    })
  )

  // logger
  .use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });



  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJyZW1vbnMifSwiY3RpbWUiOjE2MTgzMjA5NjQzMTgsImV4cGlyZXNJbiI6NjA0ODAwMDAwLCJpYXQiOjE2MTgzMjA5NjR9.uPGuDVNuS6GjysnKD8rQNTIWM2FvA_m9xYnALtnEk0s'
  varifyToken(token)
// routes
InitManger.InitCore(app)
// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
