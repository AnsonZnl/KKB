
const Koa= require('koa')
const app = new Koa();
const Router = require("koa-router");
const bouncer = require("koa-bouncer");
const router = new Router();

router.post("/", async ctx => {
  try {
    // 输入验证
    const { smsCode: { code, to, expires }, captcha } = ctx.session;
    ctx
      .validateBody("phone")
      .required("必须提供手机号")
      .isString()
      .trim()
      .match(/1[3-9]\d{9}/, "手机号不合法")
      .eq(to, "请填写接收短信的手机号");
    ctx
      .validateBody("code")
      .required("必须提供短信验证码")
      .isString()
      .trim()
      .isLength(6, 6, "必须是6位验证码")
      .eq(code, "验证码填写有误")
      .checkPred(() => new Date() - new Date(expires) < 0, "验证码已过期");
    ctx
      .validateBody("password")
      .required("必须提供密码")
      .isString()
      .trim()
      .match(/[a-zA-Z0-9]{6,16}/, "密码不合法");
    ctx
      .validateBody('captcha')
      .eq(captcha,'图形验证码有误')

      // 入库, 略
      ctx.body = { ok: 1 };
  } catch (error) {
    if (error instanceof bouncer.ValidationError) {
      console.log(error);

      ctx.status = 401;
    } else {
      ctx.status = 500;
    }
    ctx.body = { ok: 0, message: error.message };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000, () => {
    console.log("server running at http://localhost:3000")
})