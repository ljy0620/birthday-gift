# 生日小站 MVP

## 功能
- 倒计时主页
- 图文动态发布
- 学习打卡记录
- 课程表展示
- 浏览器本地保存内容

## 技术栈
- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase

## 本地运行
1. 安装依赖
   ```bash
   npm install --cache .npm-cache
   ```
2. 启动开发服务器
   ```bash
   npm run dev
   ```
3. 打开浏览器访问 http://localhost:3000

## 最短部署
步骤写在 `VERCEL_QUICKSTART.md`。

## 另一台电脑运行
- 两台电脑都安装 Node.js
- 两台电脑都执行 `npm install --cache .npm-cache`
- 两台电脑都执行 `npm run dev`
- 这种方式可以运行，但两边的数据不会自动同步

## 在线持久化
- Supabase 快速上手写在 `SUPABASE_QUICKSTART.md`
- Supabase 存储桶步骤写在 `SUPABASE_STORAGE_QUICKSTART.md`
- Supabase 建表 SQL 和环境变量模板写在 `SUPABASE.md`
- Vercel 和本地环境变量示例写在 `ENV_EXAMPLE.md`
- 本地已经保留回退方案，适合先部署再逐步接在线数据库

## 上线前检查
- 部署后自测清单写在 `POST_DEPLOY_CHECKLIST.md`
- 完整清单写在 `CHECKLIST.md`

## 如果你要让另一台电脑直接用
最推荐的方式是先部署到 Vercel，然后在那台电脑直接打开部署后的网址。

## 后续扩展
- 接入登录和头像
- 增加编辑、删除、评论功能
