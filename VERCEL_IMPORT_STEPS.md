# Vercel 导入仓库一步一步操作

## 1. 打开 Vercel
访问：https://vercel.com

## 2. 登录
用你的 GitHub 账号登录。

## 3. 新建项目
点击 `New Project`。

## 4. 选择仓库
在列表里找到 `birthday-gift`，点击 `Import`。

## 5. 配置环境变量 ⚠️ 必须在点 Deploy 之前

在部署页面找到 **Environment Variables**，添加两条：

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<你的项目>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` |

真实值不用去后台翻——直接打开项目根目录的 `.env.local`，
把里面两行的等号右边原样复制过来就行（那两行就是当前本地调通的配置）。

> 本文档只写占位符，不放真实值：仓库是公开的，
> 文档里一旦留下真实凭据，以后换成高权限密钥时容易连自己也一起泄出去。
> 真实的两个值只存在于 `.env.local`（已被 `.gitignore` 挡住）和你自己粘贴的地方。

**为什么这一步不能漏：**

`NEXT_PUBLIC_` 开头的变量是在**构建时**被写进 JS 文件里的。
如果这里没填，Vercel 一样能构建成功、网址一样能打开、页面看起来一切正常——
但线上版本会静默退回成本地存储：**你发的动态只存在你自己的浏览器里，
你女朋友那台电脑上什么都看不到。**

这种失败在浏览器里**看不出任何异常**，所以不能靠"打开看看能跑"来判断。
部署完用下面的脚本查：

```bash
node scripts/check-deploy.mjs https://你的网址.vercel.app
```

它会去前端代码里找 Supabase 地址在不在，在就是配好了，不在就是漏了。

> 填错了想改：Vercel → 项目 → Settings → Environment Variables。
> 改完必须 **Redeploy** 才生效，因为变量是构建时注入的，光改配置没用。

## 6. 部署
点击 `Deploy`。等一分钟左右。

## 7. 验证
```bash
node scripts/check-deploy.mjs https://你的网址.vercel.app
```

四项全过之后，再打开网址人工看一遍首页、动态、打卡是否正常。

## 8. 另一台电脑访问
把网址发给另一台电脑打开。

**如果对方在中国大陆打不开**，那是 `vercel.app` 这个域名本身的问题，
不是你的部署坏了。确认方法：手机开热点（走蜂窝网络）再试一次，
能开就说明是网络环境问题。解决办法见 `DEPLOY.md` 里的自定义域名部分。

## 9. 以后更新
改了代码 push 到 GitHub，Vercel 会自动重新部署，不用重复上面的步骤。
