# 最短部署到 Vercel 的逐步操作

## 1. 准备 GitHub 仓库
如果你还没有把项目上传到 GitHub，先在项目目录执行：
```bash
git init
git add .
git commit -m "build birthday site"
```
然后到 GitHub 新建一个空仓库，把本地项目推上去。

## 2. 创建 Supabase 项目
1. 打开 https://supabase.com
2. 登录后点击 New project
3. 新建一个项目
4. 进入 Project Settings -> API
5. 复制以下两个值（**不要写进任何会被提交的文件**）：
   - Project URL
   - anon public key：**要完整复制，JWT 是三段用 `.` 连接的**，少一个点就会让 `createClient` 直接报错

> 这两个值请填进 Vercel 的环境变量，或本地的 `.env.local`（已在 `.gitignore` 里）。
> 文档里不要留真实值：仓库一旦公开，任何人都能凭这两个值读写你的数据库。

## 3. 在 Supabase 执行 SQL
打开 SQL Editor，把 `SUPABASE.md` 里的建表 SQL 粘贴并执行。

## 4. 部署到 Vercel
1. 打开 https://vercel.com
2. 登录
3. 点击 New Project
4. 导入你的 GitHub 仓库
5. 在 Environment Variables 里添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. 点击 Deploy

## 5. 验证
- 打开 Vercel 给你的网址
- 在另一台电脑打开同一个网址
- 测试首页、动态、打卡是否正常
- 测试新增内容后刷新是否还在

## 6. 后续更新
以后你只要改代码并 push 到 GitHub，Vercel 会自动重新部署。
