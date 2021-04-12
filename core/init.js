// init.js
const requireDirectory = require("require-directory");
const Router = require("koa-router");

class InitManger {
  // app; // 这种写法在node.js中是错误的
  // 统一初始化方法
  static InitCore(app) {
    // node.js中不支持在类中加属性的写法
    InitManger.app = app;
    InitManger.InitLoadRouters();
  }

  // 路由自动注册
  static InitLoadRouters() {
    // 获取api目录的绝对路径
    const URL = `${process.cwd()}/routes`;
    requireDirectory(module, URL, {
      visit: (obj) => {
        if (obj instanceof Router) {
          InitManger.app.use(obj.routes());
        }
      },
    });
  }
}

module.exports = InitManger;
